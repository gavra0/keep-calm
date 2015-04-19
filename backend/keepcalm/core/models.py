from django.db import models

class SupportedSite(models.Model):
	name = models.CharField(max_length=30)
	base_url = models.CharField(max_length=100)

	def __unicode__(self):
		return self.name

class User(models.Model):
	site = models.ForeignKey(SupportedSite)
	username = models.CharField(max_length=20)
	views = models.IntegerField(default=0)
	reports = models.IntegerField(default=0)

	def __unicode__(self):
		return '%s on %s' % (self.username, self.site)
