from fastapi import FastAPI

app = FastAPI(
    title="Fleet Management",
    version="0",
)

@app.get("/")
def home():
    return {"message": "Hello, World!"}

