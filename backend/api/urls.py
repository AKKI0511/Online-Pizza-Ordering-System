from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, ToppingViewSet, \
                OrderViewSet, OrderItemViewSet, \
                StripeChargeView, MenuItemDetailView

router = DefaultRouter()
router.register(r'menuitems', MenuItemViewSet)
router.register(r'toppings', ToppingViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'orderitems', OrderItemViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("charge/", StripeChargeView.as_view(), name='stripe-charge'),
    path('menuitems/<int:pk>/', MenuItemDetailView.as_view(), name='menuitem-detail'),
]
