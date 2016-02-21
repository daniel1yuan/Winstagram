from re import search, compile
import datetime

class PageParser:
	r_likes = compile("Creation Date</key>[\S\s]*?<date>(.*?)</date>") #Search likes
	r_date = compile("Entry Text</key>[\S\s].*?<string>([\S\s]*?)</string>") #Search Date
	r_url = compile("UUID</key>[\S\s]*?<string>(.*?)</string>")	#Search og:image
	r_nurl = compile("UUID</key>[\S\s]*?<string>(.*?)</string>")

