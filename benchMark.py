from locust import HttpUser, task, between
import random
import string
user_ids = [''.join(random.choices(string.ascii_lowercase + string.digits, k=10)) for _ in range(100)]

class UserBehavior(HttpUser):
    wait_time = between(0.066, 0.066)  # 每秒请求15次
    def on_start(self):
        """ on_start is called when a Locust start before any task is scheduled """
    @task
    def test1(self):
        userId = random.choice(user_ids)
        self.client.get("/test1", params={"userId": userId})
    @task
    def test2(self):
        userId = random.choice(user_ids)
        self.client.get("/test2", params={"userId": userId})