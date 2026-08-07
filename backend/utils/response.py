"""
=========================================================
Standard API Response

=========================================================
"""

def success_response(
    data=None,
    message="Success",
    **extra,
):

    response = {
        "success": True,
        "message": message,
        "data": data,
    }

    response.update(extra)

    return response


def error_response(
    message,
    **extra,
):

    response = {
        "success": False,
        "message": message,
    }

    response.update(extra)

    return response