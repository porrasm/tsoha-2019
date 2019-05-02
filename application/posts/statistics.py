from sqlalchemy.sql import text

def count_of_rows(table_name):

    stmt = text(f"""SELECT COUNT(*) FROM {table_name}""")

    response = db.engine.execute(stmt)

    return response.first()

def average_user_post_amount():

    stmt = text(f"""SELECT COUNT(*) FROM Post / SELECT COUNT(*) FROM Post""")

    response = db.engine.execute(stmt)

    return response.first()