
import json

from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import render
from django.http import JsonResponse

from .models import Article, Comment


def index(request):
    context = {'articles': Article.objects.all()}
    return render(request, 'comments/index.html', context)


def all_comments(request):

    if request.method == 'GET':
        comments = Comment.objects.all()
        comment_obj = []
        for comment in comments:
            comment_obj.append({
                'pk': comment.pk,
                'content': comment.content,
                'owner': comment.owner.username
            })
        context = {'data': json.dumps(comment_obj)}
        return JsonResponse(context)
    elif request.method == 'POST':
        content = request.POST.get('text')
        user = User.objects.get(username=request.user)
        Comment.objects.create(content=content, owner=user)
        comments = Comment.objects.all()
        comment_obj = []
        for comment in comments:
            comment_obj.append({
                'pk': comment.pk,
                'content': comment.content,
                'owner': comment.owner.username
            })
        context = {'data': json.dumps(comment_obj)}
        return JsonResponse(context)
