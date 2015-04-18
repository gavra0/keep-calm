from django.contrib import admin

from core.models import SupportedSite, User

admin.site.register(SupportedSite)
admin.site.register(User)
