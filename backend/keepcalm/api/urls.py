from django.conf.urls import patterns, include, url
from django.contrib import admin

from views import api_root, SupportedSiteList, UserList, UserNegativeReport, UserCheck

urlpatterns = patterns('',
	url(r'^$', api_root, name='api_root'),
	url(r'^site/$', SupportedSiteList.as_view(), name='site_list'),
	url(r'^user/$', UserList.as_view(), name='user_list'),
	url(r'^report/$', UserNegativeReport.as_view(), name='user_report'),
	url(r'^check/$', UserCheck.as_view(), name='user_check'),
)
