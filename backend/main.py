from fastapi import FastAPI
from database.database import engine


app = FastAPI(
    title="Fleet Management API",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Fleet Management API running"
    }


@app.get("/database")
def database_test():

    try:
        connection = engine.connect()
        connection.close()

        return {
            "database": "connected"
        }

    except Exception as e:

        return {
            "database": "failed",
            "error": str(e)
        }