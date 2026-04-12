import asyncio
from pathlib import Path

import asyncpg
from dotenv import dotenv_values


def to_asyncpg_url(url: str) -> str:
    return url.replace("postgresql+asyncpg://", "postgresql://")


async def main() -> None:
    config = dotenv_values(".env")
    database_url = config.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is missing in backend/.env")

    sql_path = Path("migrate_to_new_data_model.sql")
    if not sql_path.exists():
        raise RuntimeError("migrate_to_new_data_model.sql not found in backend/")

    sql = sql_path.read_text(encoding="utf-8")
    conn = await asyncpg.connect(to_asyncpg_url(database_url))
    try:
        await conn.execute(sql)
        print("Migration completed successfully.")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
