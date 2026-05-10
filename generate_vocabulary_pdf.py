import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

FONT_PATH = "/usr/share/fonts/truetype/mm/MyanmarSabae.ttf"
FONT_NAME = "MyanmarFont"

def create_vocabulary_pdf(filename):
    if os.path.exists(FONT_PATH):
        pdfmetrics.registerFont(TTFont(FONT_NAME, FONT_PATH))
        display_font = FONT_NAME
    else:
        print("Warning: Myanmar font not found. Using Helvetica.")
        display_font = "Helvetica"

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=20,
        leftMargin=20,
        topMargin=30,
        bottomMargin=30
    )
    elements = []
    styles = getSampleStyleSheet()

    title = Paragraph("English-Myanmar Vocabulary: List C", styles['Title'])
    elements.append(title)
    elements.append(Spacer(1, 20))

    data = [["No.", "Word", "Myanmar Meaning", "Example Sentence"]]

    vocab_list = [
        ["1", "Calm (adj)", "တည်ငြိမ်သော၊ အေးဆေးသော", "Please stay calm and don't panic."],
        ["2", "Campaign (n)", "လှုပ်ရှားမှု (နိုင်ငံရေး၊ ကြော်ငြာ)", "They started a campaign against smoking."],
        ["3", "Campus (n)", "တက္ကသိုလ်ဝင်း", "Most students live on campus."],
        ["4", "Candidate (n)", "ကိုယ်စားလှယ်လောင်း", "He is a strong candidate for the job."],
        ["5", "Cap (n)", "ဦးထုပ် (လျှာထိုး)၊ အဖုံး", "Put the cap back on the bottle."],
        ["6", "Captain (n)", "သင်္ဘောကပ္ပတိန်၊ အသင်းခေါင်းဆောင်", "He is the captain of our football team."],
        ["7", "Career (n)", "သက်မွေးဝမ်းကျောင်း", "She wants a career in nursing."],
        ["8", "Careless (adj)", "ပေါ့ဆသော၊ ဂရုမစိုက်သော", "It was careless of you to lose your keys."],
        ["9", "Category (n)", "အမျိုးအစား၊ ကဏ္ဍ", "Books are divided into different categories."],
        ["10", "Ceiling (n)", "မျက်နှာကျက်", "There is a fan on the ceiling."],
        ["11", "Celebration (n)", "အောင်ပွဲခံခြင်း၊ ပွဲလမ်းသဘင်", "We had a big celebration for his birthday."],
        ["12", "Central (adj)", "ဗဟိုကျသော", "Our office is in central Yangon."],
        ["13", "Century (n)", "ရာစုနှစ် (နှစ် ၁၀၀)", "We are living in the 21st century."],
        ["14", "Ceremony (n)", "အခမ်းအနား", "The wedding ceremony was beautiful."],
        ["15", "Chain (n)", "သံကြိုး", "He wore a gold chain around his neck."],
        ["16", "Challenge (n/v)", "စိန်ခေါ်မှု / စိန်ခေါ်သည်", "Learning a new language is a challenge."],
        ["17", "Champion (n)", "ချန်ပီယံ", "They are the world champions."],
        ["18", "Channel (n)", "ရုပ်သံလိုင်း", "Which channel is the news on?"],
        ["19", "Chapter (n)", "အခန်း (စာအုပ်)", "I am reading the final chapter."],
        ["20", "Charge (n/v)", "အခကြေးငွေ / အားသွင်းသည်", "How much do you charge for delivery?"],
        ["21", "To cheat (v)", "လိမ်လည်သည်၊ ခိုးချသည်", "Never cheat in an exam."],
        ["22", "Cheerful (adj)", "ရွှင်လန်းတက်ကြွသော", "She has a cheerful personality."],
        ["23", "Chemical (n/adj)", "ဓာတုပစ္စည်း", "Some chemicals are dangerous."],
        ["24", "Chest (n)", "ရင်ဘတ်", "He felt a pain in his chest."],
        ["25", "Childhood (n)", "ကလေးဘဝ", "I had a very happy childhood."],
        ["26", "To claim (v/n)", "တောင်းဆိုသည်၊ အခိုင်အမာပြောသည်", "He claims that he saw a ghost."],
        ["27", "Click (n/v)", "ကလစ်နှိပ်သံ / နှိပ်သည်", "Click the link to open the file."],
        ["28", "Client (n)", "ဖောက်သည်", "We have a meeting with an important client."],
        ["29", "Close (adj)", "နီးကပ်သော၊ ရင်းနှီးသော", "My school is close to my house."],
        ["30", "Cloth (n)", "အဝတ်အထည်", "Use a damp cloth to clean the table."],
        ["31", "Clue (n)", "သဲလွန်စ", "The police found a clue at the scene."],
        ["32", "Coach (n)", "နည်းပြ", "Our basketball coach is very strict."],
        ["33", "Coal (n)", "ကျောက်မီးသွေး", "Coal is used to produce electricity."],
        ["34", "Collection (n)", "စုဆောင်းမှု", "He has a large stamp collection."],
        ["35", "Coloured (adj)", "ရောင်စုံ", "I used coloured pencils for my drawing."],
        ["36", "To combine (v)", "ပေါင်းစပ်သည်", "You need to combine sugar and flour."],
        ["37", "To comment (v)", "မှတ်ချက်ပေးသည်", "I don't want to comment on that matter."],
        ["38", "Commercial (adj/n)", "စီးပွားရေးဆိုင်ရာ / ကြော်ငြာ", "I saw an interesting commercial on TV."],
        ["39", "To commit (v)", "ကျူးလွန်သည်", "He did not commit the crime."],
        ["40", "Communication (n)", "ဆက်သွယ်ရေး", "Good communication is key to success."],
        ["41", "Comparison (n)", "နှိုင်းယှဉ်ချက်", "There is no comparison between them."],
        ["42", "Competitor (n)", "ပြိုင်ဘက်", "Our company is better than its competitors."],
        ["43", "Competitive (adj)", "ပြိုင်ဆိုင်မှုပြင်းထန်သော", "It is a very competitive market."],
        ["44", "Complaint (n)", "တိုင်ကြားချက်", "I want to make a complaint about the food."],
        ["45", "Complex (adj)", "ရှုပ်ထွေးသော", "The problem is very complex."],
        ["46", "To concentrate (v)", "အာရုံစိုက်သည်", "I can't concentrate with all this noise."],
        ["47", "To conclude (v)", "နိဂုံးချုပ်သည်", "To conclude, I would like to thank you all."],
        ["48", "Confident (adj)", "ယုံကြည်မှုရှိသော", "Be confident during the interview."],
        ["49", "To confirm (v)", "အတည်ပြုသည်", "Please confirm your booking."],
        ["50", "To confuse (v)", "ဇဝေဇဝါဖြစ်စေသည်", "Don't confuse me with too many details."],
        ["51", "Confused (adj)", "စိတ်ရှုပ်ထွေးနေသော", "I am still confused about the rules."],
        ["52", "Connection (n)", "ဆက်သွယ်မှု", "There is no internet connection here."],
        ["53", "To contact (v/n)", "ဆက်သွယ်သည်", "Please contact me if you need help."],
        ["54", "Container (n)", "ကွန်တိန်နာ၊ ဗူး", "Keep the food in an airtight container."],
        ["55", "Content (n)", "အကြောင်းအရာ", "The content of the book is very useful."],
        ["56", "Continuous (adj)", "အဆက်မပြတ်ဖြစ်သော", "I heard a continuous noise all night."],
        ["57", "Contrast (n/v)", "ကွဲပြားခြားနားမှု", "There is a big contrast between them."],
        ["58", "Convenient (adj)", "အဆင်ပြေသော", "This app is very convenient to use."],
        ["59", "To convince (v)", "ယုံကြည်အောင်ပြောဆိုသည်", "I tried to convince him to stay."],
        ["60", "Copper (n)", "ကြေးနီ", "These pipes are made of copper."],
        ["61", "Costume (n)", "ဝတ်စုံ", "Everyone wore a fancy costume to the party."],
        ["62", "Cottage (n)", "တဲအိမ်ငယ်လေး", "They live in a small cottage in the woods."],
        ["63", "Cotton (n)", "ဂွမ်း၊ ချည်", "This shirt is made of 100% cotton."],
        ["64", "Countryside (n)", "တောနယ်၊ ကျေးလက်", "I love the fresh air of the countryside."],
        ["65", "Court (n)", "တရားရုံး၊ အားကစားကွင်း", "The case is now in court."],
        ["66", "Cover (n/v)", "အဖုံး / ဖုံးအုပ်သည်", "Please cover the food."],
        ["67", "Covered (adj)", "ဖုံးအုပ်ထားသော", "The ground was covered with snow."],
        ["68", "To create (v)", "ဖန်တီးသည်", "We need to create a new plan."],
        ["69", "Credit (n)", "အကြွေး၊ ဂုဏ်ပြုမှု", "He deserves credit for his hard work."],
        ["70", "Cruel (adj)", "ရက်စက်သော", "Don't be cruel to animals."],
        ["71", "Cultural (adj)", "ယဉ်ကျေးမှုဆိုင်ရာ", "We visited many cultural sites."],
        ["72", "Culture (n)", "ယဉ်ကျေးမှု", "I want to learn about different cultures."],
        ["73", "Currency (n)", "ငွေကြေး", "What is the local currency here?"],
        ["74", "Current (adj)", "လက်ရှိဖြစ်သော", "What is your current address?"],
        ["75", "Currently (adv)", "လတ်တလောတွင်", "She is currently working in London."],
        ["76", "Curtain (n)", "လိုက်ကာ", "Please close the curtain."],
        ["77", "Custom (n)", "ဓလေ့ထုံးစံ", "It is a local custom to wear hats."]
    ]

    data.extend(vocab_list)

    table = Table(data, colWidths=[30, 90, 130, 280], repeatRows=1)

    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('FONTNAME', (2, 1), (2, -1), display_font),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey])
    ])
    table.setStyle(style)

    elements.append(table)
    doc.build(elements)
    print(f"PDF Successfully generated: {filename}")

if __name__ == "__main__":
    create_vocabulary_pdf("Vocabulary_List_C_Final.pdf")
