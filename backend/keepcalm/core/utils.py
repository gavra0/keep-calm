from core.models import SupportedSite, User

import re

def get_supported_site(url):
	""" Get the site object in the db if the site is supported """
	
	if url:
		base_domain = re.search("(?P<url>https?://[^\s\/]+)", url).group('url')
		supported_sites = SupportedSite.objects.all()
		for site in supported_sites:
			if base_domain.endswith(site.base_url):
				return site
	return None


def get_user(site, username):
	""" Get/Create user from site/username pair """

	if not site or not username:
		return None

	if type(site) == str or type(site) == unicode:
		supported_site = get_supported_site(site)
	else:
		supported_site = site

	obj, created = User.objects.get_or_create(site=supported_site, username=username)
	return obj


def report_negative(user):
	""" Increment the negative reports of a user """
	try:
		user.negative_reports += 1
		user.save()
	except Exception as e:
		return (False, e)
	return (True, '')


def report_positive(user):
	""" Increment the positive reports of a user """
	try:
		user.positive_reports += 1
		user.save()
	except Exception as e:
		return (False, e)
	return (True, '')
