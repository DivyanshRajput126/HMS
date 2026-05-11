from fastapi import FastAPI
from app.routers.users import router as users_router
from app.routers.rooms import router as rooms_router
from app.routers.customers import router as customers_router
from app.routers.expenses import router as expenses_router
from app.routers.guests import router as guests_router
from app.routers.auth import router as auth_router
from app.routers.reports import router as reports_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
import sys


app = FastAPI(title="Hotel Management System")

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. REGISTER API ROUTERS (Must come BEFORE static mounting)
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(rooms_router, prefix="/api/rooms", tags=["Rooms"])
app.include_router(customers_router, prefix="/api/customers", tags=["Customers"])
app.include_router(guests_router, prefix="/api/guests", tags=["Guests"])
app.include_router(expenses_router, prefix="/api/expenses", tags=["Expenses"])
app.include_router(reports_router, prefix="/api/reports", tags=["Reports"])

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DIST_DIR = os.path.join(BASE_DIR, "dist")

# 2. SERVE STATIC ASSETS (CSS/JS)
if os.path.exists(DIST_DIR):
    # This handles the /assets/ folder directly
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

# 3. THE CATCH-ALL ROUTE (Fixes Rooms/Expenses blank page)
@app.get("/{catchall:path}")
async def serve_react_app(catchall: str):
    # Log the catchall for debugging
    print(f"Catchall received: {catchall}")

    # Check if the path starts with 'api' (no leading slash)
    # This prevents the frontend from stealing requests meant for routers
    if catchall.startswith("api"):
        # If it reached here, it means the router didn't find the path
        return {"error": f"API route '/{catchall}' not found"}, 404

    # Return index.html for any other route so React Router can take over
    index_path = os.path.join(DIST_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"error": "Frontend build not found"}, 404

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)