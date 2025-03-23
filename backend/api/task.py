from apscheduler.schedulers.background import BackgroundScheduler

# import date trigger
from apscheduler.triggers.date import DateTrigger

# interval trigger as well
from apscheduler.triggers.interval import IntervalTrigger

scheduler = BackgroundScheduler()

scheduler.start()


