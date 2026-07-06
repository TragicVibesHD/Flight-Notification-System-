# explicitly instead of using *
from .user import user_views
from .index import index_views
from .auth import auth_views
from .customer import customer_views
from .notification import notification_views


views = [user_views, index_views, auth_views, customer_views, notification_views]
# blueprints must be added to this list