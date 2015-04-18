from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.reverse import reverse

from core.models import SupportedSite, User
from core.utils import get_supported_site, get_user, report_negative, report_positive

from api.serializers import SupportedSiteSerializer, UserSerializer

def operation_failure(msg=''):
	return "{ 'success': false, 'message': " + str(msg) + "}"

def operation_success():
	return "{ 'success': true }"

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

class UserNegativeReport(APIView):
	def post(self, request, format=None):
		site = request.DATA.get('site', None)
		username = request.DATA.get('username', None)

		supported_site = get_supported_site(site)
		user = get_user(supported_site, username)

		if user:
			success, msg = report_negative(user)
			response_data = operation_success() if success else operation_failure(msg)
		else:
			response_data = operation_failure('Invalid site or username')

		return Response(response_data)

class UserCheck(APIView):
	def post(self, request, format=None):
		return Response(operation_success())
