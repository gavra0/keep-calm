from rest_framework import serializers
from rest_framework.reverse import reverse

from core.models import SupportedSite, User

class SupportedSiteSerializer(serializers.ModelSerializer):
	class Meta:
		model = SupportedSite
		fields = ('name', 'base_url', )

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('username', 'views', 'reports', )
