from re import search, compile

class PageParser:
    r_likes = compile("\"likes\":{\"count\":(\d\d),\"") #Search likes
    r_date = compile(",\"date\":(.*?),") #Search Date
    r_url = compile("og:image.+?(https://.+?.jpg)")	#Search og:image

    @staticmethod
    def get_info_from_post(raw):
        likes = int(search(PageParser.r_likes, raw).group(1))
        date = float(search(PageParser.r_date, raw).group(1))
        img_url = search(PageParser.r_url, raw).group(1)
        print likes, date, img_url