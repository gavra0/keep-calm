from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse

from core.models import SupportedSite, User

from api.serializers import SupportedSiteSerializer, UserSerializer

import re

def extract_domain(url):
	base_domain = re.search("(?P<url>https?://[^\s\/]+)", url).group('url')
	if base_domain.endswith('twitter.com'):
		return 'twitter'
	else:
		return None # invalid


@api_view(('GET', ))
def api_root(request, format=None):
	"""Root return links to the resources publicly available in the API."""
	return Response({
		'site': reverse('site_list', request=request, format=format),
		'user': reverse('user_list', request=request, format=format),
		'report': reverse('user_report', request=request, format=format),
		'check': reverse('user_check', request=request, format=format),
		})

class SupportedSiteList(APIView):
	""" Lists all the supported sites """
	def get(self, request, format=None):
		supported_sites = SupportedSite.objects.all()
		serializer = SupportedSiteSerializer(supported_sites, many=True)
		return Response(serializer.data)

class UserList(APIView):
	""" Lists all the users """
	def get(self, request, format=None):
		twitter_users = User.objects.all()
		serializer = UserSerializer(twitter_users, many=True)
		return Response(serializer.data)

class UserReport(APIView):
	def post(self, request, format=None):
		return

class UserCheck(APIView):
	def post(self, request, format=None):
		return
