from .models import Post
from django.http import JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import *
from itertools import chain
import random
from rest_framework.views import APIView
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from .serializers import *
from django.template.loader import render_to_string
from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.template import Template, Context
from .permissions import *


class ProfileViewSet(ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
class FollowerscountViewSet(ModelViewSet):
    queryset = Followerscount.objects.all()
    serializer_class = FollowerscountSerializer
    
    
class UserViewSet(ModelViewSet):
    permission_classes = [IsUserOnwer]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data['password'])
        user.save()
        Token.objects.get_or_create(user=user)
        subject = 'User Created'
        message = f"Congratulations! Your account has been created.\n\nUsername: {user.username}\nPassword: {serializer.validated_data['password']}"
        sender_email = 'mareedu.satyanarayana.5475@gmail.com'
        recipient_email = user.email
        send_mail(subject, message, sender_email, [
                  recipient_email], fail_silently=False)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED, headers=headers)


class UserAuthenticateView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            response_data = {
                'token': str(user.auth_token),
                'name': str(username),
                'id' : user.id
            }
            return Response(response_data, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPasswordAPIView(APIView):
    def post(self, request):
        data = request.data
        print(data)
        email = data['email']
        print(email)
        try:
            user = User.objects.get(email=email)
            print(user)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist.'}, status=404)
        else:
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            reset_password_link = f"https://insta-doppelganger.web.app/reset/{uid}/{token}"

            email_template = """
            Hi {{ user.username }},
            Please click the link below to reset your password:
            {{ reset_password_link }}
            """
            template = Template(email_template)
            context = Context({
                'user': user,
                'reset_password_link': reset_password_link,
            })
            message = template.render(context)

            send_mail('Reset your password', message,
                      'mareedu.satyanarayana.5475@gmail.com', [email])
            return Response({'success': 'Password reset email has been sent.'})


class ResetPasswordAPIView(APIView):

    def get(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid token.'}, status=400)
        else:
            if default_token_generator.check_token(user, token):
                return Response({'uidb64': uidb64, 'token': token})
            else:
                return Response({'error': 'Invalid token.'}, status=400)

    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid token.'}, status=400)
        else:
            if default_token_generator.check_token(user, token):
                new_password = request.data.get('password')
                user.set_password(new_password)
                user.save()
                return Response({'success': 'Password has been reset successfully.'})
            else:
                return Response({'error': 'Invalid token.'}, status=400)


class changePassword(APIView):
    def post(self, request):
        username = request.data.get('username')
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        confirm_password = request.data.get('confirmPassword')

        user = User.objects.get(username=username)
        if user.check_password(current_password):
            if new_password == confirm_password:
                user.set_password(new_password)
                user.save()
                return Response({'success': True})
            else:
                return Response({'success': False, 'message': 'New passwords do not match.'})
        else:
            return Response({'success': False, 'message': 'Invalid current password.'})
class Test(APIView):
    def post(self, request):
        user_req = request.data.get('name')
        user_object = get_object_or_404(User, username=user_req)
        user_profile = Profile.objects.get(user=user_object)

        user_following_list = []
        feed = []

        user_following = Followerscount.objects.filter(follower=user_req)

        for users in user_following:
            user_following_list.append(users.user)

        user_following_list.append(user_req)

        for usernames in user_following_list:
            feed_lists = Post.objects.filter(user=usernames)
            feed.append(feed_lists)

        feed_list = list(chain(*feed))

        all_users = User.objects.all()
        user_following_all = []

        for user in user_following:
            user_list = get_object_or_404(User, username=user.user)
            user_following_all.append(user_list)

        new_suggestions_list = [
            x for x in all_users if (x not in user_following_all)]
        current_user = User.objects.filter(username=user_req)
        final_suggestions_list = [
            x for x in new_suggestions_list if (x not in current_user)]
        random.shuffle(final_suggestions_list)

        username_profile = []
        username_profile_list = []

        for users in final_suggestions_list:
            username_profile.append(users.id)

        for ids in username_profile:
            profile_lists = Profile.objects.filter(id_user=ids)
            username_profile_list.append(profile_lists)

        suggestions_username_profile_list = list(chain(*username_profile_list))

        context = {
            'user_profile': user_profile,
            'posts': feed_list,
            'suggestions_username_profile_list': suggestions_username_profile_list[:5]
        }

        return JsonResponse(context)


class like_post(APIView):
    def post(self,request):
        print("entered")
        data = request.data
        post_id = data['id']
        user = User.objects.get(username = data['user'])
        post = get_object_or_404(
            Post, id=post_id)
        
        if user in post.liked_by.all():
            return JsonResponse({'message': 'You have already liked this post.'})

        post.liked_by.add(user)
        post.no_of_likes += 1
        post.save()

        return JsonResponse({'message': 'Post liked successfully.'})


class unlike_post(APIView):
    def post(self, request):
        data = request.data
        post_id = data['id']
        user = User.objects.get(username=data['user'])
        post = get_object_or_404(Post, id=post_id)
        

        if user not in post.liked_by.all():
            return JsonResponse({'message': 'You have not liked this post.'})

        post.liked_by.remove(user)
        post.no_of_likes -= 1
        post.save()

        return JsonResponse({'message': 'Post unliked successfully.'})
    

class like_reel(APIView):
    def post(self, request):
        print("entered")
        data = request.data
        post_id = data['id']
        user = User.objects.get(username=data['user'])
        post = get_object_or_404(
            Reel, id=post_id)

        if user in post.liked_by.all():
            return JsonResponse({'message': 'You have already liked this post.'})

        post.liked_by.add(user)
        post.no_of_likes += 1
        post.save()

        return JsonResponse({'message': 'Post liked successfully.'})


class unlike_reel(APIView):
    def post(self, request):
        data = request.data
        post_id = data['id']
        user = User.objects.get(username=data['user'])
        post = get_object_or_404(Reel, id=post_id)

        if user not in post.liked_by.all():
            return JsonResponse({'message': 'You have not liked this post.'})

        post.liked_by.remove(user)
        post.no_of_likes -= 1
        post.save()

        return JsonResponse({'message': 'Post unliked successfully.'})


class ReelViewSet(ModelViewSet):
    queryset = Reel.objects.all()
    serializer_class = ReelSerializer
