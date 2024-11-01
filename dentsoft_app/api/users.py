import json

import frappe
from frappe import _
from frappe.utils.caching import redis_cache

@frappe.whitelist(methods=["GET"])
def get_current_user_data():
    # Fetches current Logged in user data
    # if not frappe.has_permission("User"):
    #     frappe.throw(
    #         _(
    #             "You do not have a <b>User</b> role. Please contact your administrator to add your user profile as a <b>User</b>."
    #         ),
	# 		title=_("Insufficient permissions. Please contact your administrator."),
    #     )
    try:
        user = frappe.get_cached_doc("User", {"first_name": frappe.session.user})
    except frappe.DoesNotExistError:
        print("HI")
        user = frappe.get_doc("User", frappe.session.user)
        frappe._set_document_in_cache(f"User:{frappe.session.user}", user)
    return user
