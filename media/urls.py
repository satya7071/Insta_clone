from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'post', views.PostViewSet, basename='post')
router.register(r'follow', views.FollowerscountViewSet, basename='follow')
router.register(r'users', views.UserViewSet)
router.register(r'reels',views.ReelViewSet,basename='reels')


urlpatterns = [
    path('api/',include(router.urls)),
    path('authenticate/', views.UserAuthenticateView.as_view(),
         name='authenticate'),
    path('forgotpassword/', views.ForgotPasswordAPIView.as_view(),
         name='forgotpassword'),
    path('resetpassword/<uidb64>/<token>/',
         views.ResetPasswordAPIView.as_view(), name='resetpassword'),
    path('changepassword/', views.changePassword.as_view(), name='changepassword'),
    path('api/like', views.like_post.as_view(), name='like_post'),
    path('api/unlike',
         views.unlike_post.as_view(), name='unlike_post'),
    path('api/like/reel', views.like_reel.as_view(), name='like'),
    path('api/unlike/reel',
         views.unlike_reel.as_view(), name='unlike'),
#     path('',views.index),
#     path('signup',views.signup,name='signup'),
#     path('test/', views.Test.as_view(),
#          name='test'),
#     path('signin',views.signin,name='signin'),
#     path('logout',views.logout,name='logout'),
#     path('settings',views.settings,name='settings'),
#     path('upload', views.upload,name='upload'),
#     path('like-post',views.likepost,name='likepost'),
#     path('profile/<str:pk>',views.profile,name='profile'),
#     path('follow',views.follow,name='folllow'),
#     path('search',views.search,name='search'),
]
