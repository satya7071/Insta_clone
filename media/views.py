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
            subject = 'User Logged In'
            message = f"Congratulations you were logged in..!"
            sender_email = 'mareedu.satyanarayana.5475@gmail.com'
            recipient_email = user.email
            send_mail(subject, message, sender_email, [
                recipient_email], fail_silently=False)
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

            reset_password_link = f"http://localhost:3000/reset/{uid}/{token}"

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
        data = request.data
        post_id = data['id']
        user = User.objects.get(username = data['user'])
        post = get_object_or_404(Post, id=post_id)

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

# @login_required(login_url='signin')
# def index(request):
#     user_object = User.objects.get(username=request.user.username)
#     user_profile = Profile.objects.get(user=user_object)
    
#     user_following_list = []
#     feed = []
    
#     user_following = Followerscount.objects.filter(follower=request.user.username)
    
#     for users in  user_following:
#         user_following_list.append(users.user)

#     user_following_list.append(request.user.username)
        
#     for usernames in user_following_list:
#         feed_lists = Post.objects.filter(user=usernames)
#         feed.append(feed_lists)
        
#     feed_list = list(chain(*feed))
    
#     all_users = User.objects.all()
#     user_following_all = []
    
#     for user in user_following:
#         user_list = User.objects.get(username=user.user)
#         user_following_all.append(user_list)
    
#     new_suggestions_list = [x for x in list(all_users) if(x not in list(user_following_all))]
#     current_user = User.objects.filter(username=request.user.username)
#     final_suggestions_list = [x for x in list(new_suggestions_list) if(x not in list(current_user))]
#     random.shuffle(final_suggestions_list)
    
#     username_profile = []
#     username_profile_list = []
    
#     for users in final_suggestions_list:
#         username_profile.append(users.id)
        
#     for ids in username_profile:
#         profile_lists = Profile.objects.filter(id_user=ids)
#         username_profile_list.append(profile_lists)
        
#     suggestions_username_profile_list = list(chain(*username_profile_list))
    
#     return render(request, 'index.html', {'user_profile': user_profile, 'posts': feed_list, 'suggestions_username_profile_list': suggestions_username_profile_list[:5]})

# def signup(request): 
#     if request.method == 'POST':
#         username=request.POST.get('username')
#         email=request.POST.get('email')
#         password=request.POST.get('password')
#         conf_password=request.POST.get('conf_password')
        
#         if password == conf_password:
#             if User.objects.filter(email=email).exists():
#                 messages.info(request,'Email Already Exists')
#                 return redirect('signup')
#             elif User.objects.filter(username=username).exists():
#                 messages.info(request,'Username Taken')
#                 return redirect('signup')
#             else:
#                 user=User.objects.create_user(username=username,email=email,password=password)
#                 user.save()
                
#                 user_login = auth.authenticate(username=username,password=password)
#                 auth.login(request,user_login)
                
#                 user_model= User.objects.get(username=username)
#                 new_profile= Profile.objects.create(user=user_model,id_user=user_model.id)
#                 new_profile.save()
#                 return redirect('settings')
#         else:
#             messages.info(request,'Password Not Matching')
#             return redirect('signup')
#     else:
#         return render(request,'signup.html')

# def signin(request):
#     if request.method == 'POST':
#         username= request.POST.get('username')
#         password= request.POST.get('password')
        
#         user = auth.authenticate(username=username,password=password)
#         if user is not None:
#             auth.login(request,user)
#             return redirect('/')
#         else:
#             messages.info(request,'Please check username and password')
#             return redirect('signin')            
#     else:
#         return render(request,'signin.html')


# @login_required(login_url='signin')
# def logout(request):
#     auth.logout(request)
#     return redirect('signin')

# @login_required(login_url='signin')
# def settings(request):
#     user_profile = Profile.objects.get(user=request.user)
#     if request.method == 'POST':
#         if request.FILES.get('image') == None:
#             image = user_profile.profileimg
#             bio = request.POST.get('bio')
            
#             user_profile.profileimg = image
#             user_profile.bio = bio
#             user_profile.save()
#         if request.FILES.get('image') != None:
#             image = request.FILES.get('image')
#             bio = request.POST.get('bio')

#             user_profile.profileimg = image
#             user_profile.bio = bio
#             user_profile.save()
#     return render(request, 'settings.html',{'user_profile':user_profile})


# @login_required(login_url='signin')
# def upload(request):
#     if request.method == 'POST':
#         user = request.user.username
#         image = request.FILES.get('image_upload')
#         caption = request.POST.get('caption')
        
#         new_post = Post.objects.create(user=user, image=image, caption=caption)
#         new_post.save()
#         return redirect('/')
#     else:
#         return redirect('/')


# @login_required(login_url='signin')
# def likepost(request):
#     username = request.user.username
#     post_id = request.GET.get('post_id')
    
#     post = Post.objects.get(id=post_id)
    
#     like_filter = LikePost.objects.filter(post_id=post_id,username=username).first()

#     if like_filter == None:
#         new_like = LikePost.objects.create(post_id=post_id,username=username)
#         new_like.save()
#         post.no_of_likes = post.no_of_likes + 1
#         post.save()
#         return redirect('/')
#     else:
#         like_filter.delete()
#         post.no_of_likes = post.no_of_likes - 1
#         post.save()
#         return redirect('/')
 

# @login_required(login_url='signin')
# def profile(request,pk):
#     user_object = User.objects.get(username=pk)
#     user_profile = Profile.objects.get(user=user_object)
#     user_posts = Post.objects.filter(user=pk)
#     user_post_length = len(user_posts)
    
#     follower = request.user.username
#     user = pk
    
#     if Followerscount.objects.filter(follower=follower,user=user).first():
#         button_text = 'UnFollow'
#     else:
#         button_text = 'Follow'
#     followers_set = Followerscount.objects.filter(user=user)
#     print(followers_set)
#     followers =[]
#     following =[]
#     for i in followers_set:
        
#         j=str(i)
#         print(j)
#         k = j.split('/')[1]
#         followers.append(k)
        
#     following_set = Followerscount.objects.filter(follower=user)
#     for i in following_set:
#         j = str(i)
#         print(j)
#         k = j.split('/')[0]
#         following.append(k)
    
#     context = {
#         'user_object':user_object,
#         'user_profile': user_profile,
#         'user_posts': user_posts,
#         'user_post_length' : user_post_length,
#         'button_text' : button_text,
#         'user_followers': followers_set.count(),
#         'user_following': following_set.count(),
#         'followers': followers,
#         'following': following,
#     }
#     return render(request, 'profile.html', context)






# @login_required(login_url='signin')
# def follow(request):
#     if request.method == 'POST':
#         follower = request.POST.get('follower')
#         user = request.POST.get('user')
        
#         if Followerscount.objects.filter(follower=follower,user=user).first():
#             delete_follower = Followerscount.objects.get(follower=follower,user=user)
#             delete_follower.delete()
#             return redirect('/profile/'+user)
#         else:
#             new_follower = Followerscount.objects.create(follower=follower,user=user)
#             new_follower.save()
#             return redirect('/profile/'+user)
#     else:
#         return redirect('/')
    

# @login_required(login_url='signin')
# def search(request):
#     if request.method == 'POST':
#         username = request.POST['username']
#         if User.objects.filter(username=username, is_staff=False).exists():
#             return redirect('/profile/'+username)
#         else:
#             return render(request, 'usernotfound.html')
        
# def test(request):
#     return render(request,'aliging.html')