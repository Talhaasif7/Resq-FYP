from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr
from app.db.supabase import supabase, supabase_admin
from app.core.config import settings
from app.core.mail import send_verification_email, send_reset_password_email

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthSchema(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    city: Optional[str] = None
    role: Optional[str] = "citizen"

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

@router.post("/signup")
async def signup(credentials: AuthSchema, background_tasks: BackgroundTasks):
    try:
        # Use admin client to create user without sending built-in Supabase email
        # This bypasses the "Email rate limit exceeded" error from Supabase
        if not supabase_admin:
            raise HTTPException(status_code=500, detail="Admin client not configured. Check SUPABASE_SERVICE_ROLE_KEY.")

        # Create user via admin API
        user_response = supabase_admin.auth.admin.create_user({
            "email": credentials.email,
            "password": credentials.password,
            "email_confirm": False, # Don't confirm yet
            "user_metadata": {
                "full_name": credentials.name,
                "city": credentials.city,
                "role": credentials.role
            }
        })
        
        if not user_response:
             raise HTTPException(status_code=400, detail="Signup failed")
        
        # Generate custom verification link
        try:
            link_response = supabase_admin.auth.admin.generate_link({
                "type": "signup",
                "email": credentials.email,
                "options": {"redirect_to": f"{settings.FRONTEND_URL}/signin"}
            })
            
            if link_response.properties.action_link:
                background_tasks.add_task(
                    send_verification_email, 
                    credentials.email, 
                    link_response.properties.action_link
                )
        except Exception as mail_err:
            print(f"Error generating/sending custom verification mail: {mail_err}")
            # Even if mail fails, the user is created
        
        return {
            "message": "Signup successful. Please check your email to verify your account.",
            "user": user_response,
            "requires_verification": True
        }
    except Exception as e:
        print(f"Signup error: {e}")
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise HTTPException(status_code=400, detail="An account with this email already exists.")
        raise HTTPException(status_code=400, detail=error_msg)

@router.post("/signin")
@router.post("/login")
async def login(credentials: AuthSchema):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        if response.session is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"message": "Login successful", "session": response.session}
    except Exception as e:
        error_msg = str(e).lower()
        if "email not confirmed" in error_msg:
            raise HTTPException(
                status_code=403, 
                detail="Email not verified. Please check your inbox for the confirmation link."
            )
        if "invalid login credentials" in error_msg:
             raise HTTPException(status_code=401, detail="Invalid email or password.")
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordSchema, background_tasks: BackgroundTasks):
    try:
        if supabase_admin:
            link_response = supabase_admin.auth.admin.generate_link({
                "type": "recovery",
                "email": data.email,
                "options": {"redirect_to": f"{settings.FRONTEND_URL}/reset-password"}
            })
            if link_response.properties.action_link:
                background_tasks.add_task(
                    send_reset_password_email, 
                    data.email, 
                    link_response.properties.action_link
                )
                return {"message": "Password reset instructions sent to your email."}
        
        # Fallback to Supabase built-in email if admin generation fails
        supabase.auth.reset_password_for_email(
            data.email,
            {"redirect_to": f"{settings.FRONTEND_URL}/reset-password"}
        )
        return {"message": "Password reset instructions sent to your email."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/reset-password")
async def reset_password(data: ResetPasswordSchema):
    try:
        # In this flow, the user clicks the link, is redirected to the frontend
        # with an access token, and the frontend should be using that token
        # to call update_user.
        # If we are proxing it, we assume the supabase client is authenticated.
        response = supabase.auth.update_user({"password": data.new_password})
        return {"message": "Password has been reset successfully."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/resend-verification")
async def resend_verification(data: ForgotPasswordSchema, background_tasks: BackgroundTasks):
    try:
        if supabase_admin:
            link_response = supabase_admin.auth.admin.generate_link({
                "type": "signup",
                "email": data.email,
                "options": {"redirect_to": f"{settings.FRONTEND_URL}/signin"}
            })
            if link_response.properties.action_link:
                background_tasks.add_task(
                    send_verification_email, 
                    data.email, 
                    link_response.properties.action_link
                )
                return {"message": "Verification email resent."}
        
        supabase.auth.resend({"type": "signup", "email": data.email})
        return {"message": "Verification email resent."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/logout")
async def logout():
    try:
        supabase.auth.sign_out()
        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
