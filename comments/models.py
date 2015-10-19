from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType


class Comment(models.Model):
    owner = models.ForeignKey(User, related_name='comments')
    content = models.TextField(max_length=512)

    #: the target of the comment
    target_type = models.ForeignKey(ContentType)
    target_id = models.PositiveIntegerField()
    target = generic.GenericForeignKey('target_type', 'target_id')

    parent = models.ForeignKey('self', blank=True, null=True,
                               related_name='replies')
    when = models.DateTimeField(auto_now_add=True)


class Article(models.Model):
    body = models.TextField(max_length=512)
    when = models.DateTimeField(auto_now_add=True)
