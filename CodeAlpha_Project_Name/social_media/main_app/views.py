# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Post

@api_view(['POST'])
def create_post(request):
    user = request.user
    content = request.data.get('content')
    if content:
        post = Post.objects.create(user=user, content=content)
        return Response({'status': 'success', 'post_id': post.id})
    return Response({'status': 'error', 'message': 'Content is required'}, status=400)

