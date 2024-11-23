Parameters

The Parameters model represent parameters passed into a given emission factors. Parameters can represent e.g. money spent, kilometers traveled, energy consumed, or fuel burned. Parameters are used together with an emission factor to produce emissions estimations.

Parameters can take multiple different unit types, depending on the emission factors. Click below to find out more about parameters for each unit type.
Unit Types

Unit types describe the categories of units available to be queried by the API for an emission factor. Each emission factor accepts a particular unit type, such as money or volume; any unit described for the unit type is acceptable, as the API will handle conversions.
Available Unit Types
Unit Types Endpoint

Climatiq provides a Unit Types endpoint to help you get all available unit types and their supported units. Learn how to use it here
Area

Calculate emissions produced by an area, such as spraying fields, expressed in hectares (ha), square kilometers (km2), square meters (m2) or square foot (ft2).
Attribute	Required	Default
area float
Area size in the defined unit	required	
area_unit string
Unit of area. One of m2, km2, ft2, ha	optional	km2

{
    //...
    "parameters": {
        "area": 30,
        "area_unit": "ha"
    }
    //...
}

AreaOverTime

Calculate emissions produced by area over time.
Attribute	Required	Default
area float
Area size in the defined unit	required	
area_unit string
Unit of area. One of m2, km2, ft2, ha	optional	km2
time float
Time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "area": 30,
        "area_unit": "ha",
        "time": 365,
        "time_unit": "day"
    }
    //...
}

ContainerOverDistance

Calculate emissions produced by moving goods inside a certain amount of twenty-foot-equivalent

containers over a distance (in kilometers, miles, nautical miles, meters or feet).
Attribute	Required	Default
twenty_foot_equivalent float
The amount of twenty-foot-equivalent containers moved	required	
distance float
Distance in the defined unit	required	
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi	optional	km

{
    //...
    "parameters": {
        "twenty_foot_equivalent": 2,
        "distance": 100,
        "distance_unit": "km"
    }
    //...
}

Data

Calculate emissions produced by a data amount, such as by transfer, expressed in megabytes (MB), gigabytes (GB) or Terabytes (TB).
Attribute	Required	Default
data float
Data size in the defined unit	required	
data_unit string
Unit of data. One of MB or GB, TB	optional	MB

{
    //...
    "parameters": {
        "data": 3,
        "data_unit": "GB"
    }
    //...
}

DataOverTime

Calculate emissions produced by data over time, such as storing data for some duration.
Attribute	Required	Default
data float
Data size in the defined unit	required	
data_unit string
Unit of data. One of MB, GB or TB	optional	MB
time float
Time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "data": 3,
        "data_unit": "GB",
        "time": 1,
        "time_unit": "h"
    }
    //...
}

Distance

Calculate emissions produced by moving a vehicle in kilometers, miles, nautical miles, meters or feet.
Attribute	Required	Default
distance float
Distance in the defined unit	required	
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi	optional	km

{
    //...
    "parameters": {
        "distance": 100,
        "distance_unit": "mi"
    }
    //...
}

DistanceOverTime

Calculate emissions produced by distance over time, such as road maintenance.
Attribute	Required	Default
distance float
Distance in the defined unit	required	
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi	optional	km
time float
Time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "distance": 100,
        "distance_unit": "mi"
        "time": 365,
        "time_unit": "days"
    }
    //...
}

Energy

Calculate emissions produced by consumption of energy in kWh, terajoules, gigajoules, megajoules or MMBTU

.
Attribute	Required	Default
energy float
Energy in the defined unit	required	
energy_unit string
Unit of energy. One of Wh, kWh, MWh, MJ, GJ, TJ, therm or MMBTU	optional	kWh

{
    //...
    "parameters": {
        "energy": 30,
        "energy_unit": "TJ"
    }
    //...
}

Money

Calculate upstream emissions produced by purchase of goods or services, for example food, clothing or services, expressed in any of the supported currencies.

Where exchange rates are applied, these are aggregated from a variety of sources, but primarily from the UN Treasury Operational Rates
and the IRS average exchange rates

for the year that the source judges the emission factor is most valid for.

Due to varying exchange rates and inflation, calculating emissions based on money spent is most accurate when the year for the emission factor is the same as the year you spent the money.
Attribute	Required	Default
money float
Money amount in the defined unit	required	
money_unit string
ISO code of currency, such as usd, eur or gbp. See the list of all supported currencies.	optional	usd

{
    //...
    "parameters": {
        "money": 100,
        "money_unit": "eur"
    }
    //...
}

Supported currencies

This table list all currencies that the Climatiq API supports. Pass in the ISO Currency Code into the API to use a specific currency.
ISO Currency Code	Country	Currency name
aed	United Arab Emirates	UAE dirham
afn	Afghanistan	Afghan afghani
all	Albania	Albanian lek
amd	Armenia	Armenian dram
ang	Curaçao	Netherlands Antillean gulden
aoa	Angola	Angolan kwanza
ars	Argentina	Argentine peso
aud	Australia	Australian dollar
awg	Aruba	Aruban florin
azn	Azerbaijan	Azerbaijani manat
bam	Bosnia and Herzegovina	Bosnia and Herzegovina konvertibilna marka
bbd	Barbados	Barbadian dollar
bdt	Bangladesh	Bangladeshi taka
bgn	Bulgaria	Bulgarian lev
bhd	Bahrain	Bahraini dinar
bif	Burundi	Burundi franc
bmd	Bermuda	Bermudian dollar
bnd	Brunei Darussalam	Brunei dollar
bob	Plurinational State of Bolivia	Bolivian boliviano
brl	Brazil	Brazilian real
bsd	Bahamas	Bahamian dollar
bwp	Botswana	Botswana pula
byn	Belarus	Belarusian ruble
cad	Canada	Canadian dollar
chf	Switzerland & Liechtenstein	Swiss franc
clp	Chile	Chilean peso
cny	China	Chinese/Yuan renminbi
cop	Colombia	Colombian peso
crc	Costa Rica	Costa Rican colon
cve	Cape Verde	Cape Verdean escudo
czk	Czechia	Czech koruna
djf	Djibouti	Djiboutian franc
dkk	Denmark	Danish krone
dop	Dominican Republic	Dominican peso
dzd	Algeria	Algerian dinar
egp	Egypt	Egyptian pound
etb	Ethiopia	Ethiopian birr
eur	Euro Zone	European Euro
fjd	Fiji	Fijian dollar
gbp	United Kingdom	British pound
gel	Georgia	Georgian lari
ghs	Ghana	Ghanaian cedi
gip	Gibraltar	Gibraltar pound
gmd	Gambia	Gambian dalasi
gtq	Guatemala	Guatemalan quetzal
gyd	Guyana	Guyanese dollar
hkd	Hong Kong	Hong Kong dollar
hnl	Honduras	Honduran lempira
hrk	Croatia	Croatian kuna
huf	Hungary	Hungarian forint
idr	Indonesia	Indonesian rupiah
ils	Israel	Israeli new sheqel
inr	India	Indian rupee
iqd	Iraq	Iraqi dinar
irr	Iran	Iranian rial
isk	Iceland	Icelandic króna
jmd	Jamaica	Jamaican dollar
jod	Jordan	Jordanian dinar
jpy	Japan	Japanese yen
kes	Kenya	Kenyan shilling
kgs	Kyrgyzstan	Kyrgyzstani som
khr	Cambodia	Cambodian riel
kmf	Comoros	Comorian franc
krw	South Korea	South Korean won
kwd	Kuwait	Kuwaiti dinar
kyd	Cayman Islands	Cayman Islands dollar
kzt	Kazakhstan	Kazakhstani tenge
lak	Lao People's Democratic Republic	Lao kip
lbp	Lebanon	Lebanese lira
lsl	Lesotho	Lesotho loti
lyd	Libya	Libyan dinar
mad	Morocco	Moroccan dirham
mdl	Moldova, Republic of	Moldovan leu
mga	Madagascar	Malagasy ariary
mkd	North Macedonia	Macedonian denar
mop	Macao	Macanese pataca
mur	Mauritius	Mauritian rupee
mur	Mauritius	Mauritian rupee
mvr	Maldives	Maldivian rufiyaa
mxn	Mexico	Mexican peso
myr	Malaysia	Malaysian ringgit
mzn	Mozambique	Mozambican metical
nad	Namibia	Namibian dollar
nio	Nicaragua	Nicaraguan córdoba
nok	Norway	Norwegian krone
npr	Nepal	Nepalese rupee
nzd	New Zealand	New Zealand dollar
omr	Oman	Omani rial
pab	Panama	Panamanian balboa
pen	Peru	Peruvian nuevo sol
php	The Philippines	Philippine peso
pkr	Pakistan	Pakistani rupee
pln	Poland	Polish zloty
pyg	Paraguay	Paraguayan guarani
qar	Qatar	Qatari riyal
ron	Romania	Romanian leu
rsd	Serbia	Serbian dinar
rub	Russian Federation	Russian ruble
rwf	Rwanda	Rwandan franc
sar	Saudi Arabia	Saudi riyal
scr	Seychelles	Seychellois rupee
sek	Sweden	Swedish krona
sgd	Singapore	Singapore dollar
sll	Sierra Leone	Sierra Leonean leone
srd	Suriname	Surinamese dollar
std	Sao Tome and Principe	São Tomé and Príncipe dobra
svc	El Salvador	Salvadoran Colon
szl	Eswatini	Swazi lilangeni
thb	Thailand	Thai baht
tjs	Tajikistan	Tajikistani somoni
tnd	Tunisia	Tunisian dinar
try	Turkey	Turkish new lira
ttd	Trinidad and Tobago	Trinidad and Tobago dollar
twd	Taiwan	New Taiwan dollar
uah	Ukraine	Ukrainian hryvnia
ugx	Uganda	Ugandan shilling
usd	American Samoa	United States dollar
uyu	Uruguay	Uruguayan peso
uzs	Uzbekistan	Uzbekistani som
vnd	Vietnam	Vietnamese dong
wst	Samoa	Samoan tala
xaf	Cameroon	Central African CFA franc
xcd	Antigua and Barbuda	East Caribbean dollar
xof	Benin	West African CFA franc
xpf	French Polynesia	CFP franc
yer	Yemen	Yemeni rial
zar	South Africa	South African rand
zmw	Zambia	Zambian kwacha
Number

This method works as a fallback for units without conversions like Hotel nights.
Attribute	Required
number float
Unit amount	required

{
    //...
    "parameters": {
        "number": 3
    }
    //...
}

NumberOverTime

Calculate emissions by a number in a given time expressed in days, hours, minutes, seconds or milliseconds. The numbers are multiplied together, so doubling the number or the time will yield the same results.
Attribute	Required	Default
number float
The number	required	
time float
The time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "number": 15,
        "time": 3,
        "time_unit": "m"
    }
    //...
}

PassengerOverDistance

Calculate emissions produced by moving a number of passengers over a given distance in kilometers, miles, nautical miles, meters or feet.
Attribute	Required	Default
passengers integer
Number of passengers	optional	1
distance float
Distance in the defined unit	required	
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi	optional	km

{
    //...
    "parameters": {
        "passengers": 4,
        "distance": 100,
        "distance_unit": "mi"
    }
    //...
}

Time

Calculate emissions in a given time expressed in (average) years, days, hours, minutes, seconds or milliseconds.
Attribute	Required	Default
time float
Time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "time": 3,
        "time_unit": "m"
    }
    //...
}

Volume

Calculate emissions produced by volume of material consumed or utilized in a process or activity; for example diesel, expressed in liters, milliliters, cubic meters, standard cubic foot or US gallons.
Attribute	Required	Default
volume float
Volume in the defined unit	required	
volume_unit string
Unit of volume. One of ml, l, m3, standard_cubic_foot, gallons_us, bbl	optional	l

{
    //...
    "parameters": {
        "volume": 15,
        "volume_unit": "l"
    }
    //...
}

Weight

Calculate emissions produced by total weight of material consumed, utilized or transported in a process or activity, expressed in kilograms, tonnes (metric tons) or US short tons.
Attribute	Required	Default
weight float
Weight in the defined unit	required	
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton)	optional	kg

{
    //...
    "parameters": {
        "weight": 80,
        "weight_unit": "t"
    }
    //...
}

WeightOverDistance

Calculate emissions produced by moving goods of a certain weight (expressed in kilograms, tonnes (metric tons) or US short tons) over a distance (in kilometers, miles, nautical miles, meters or feet).
Attribute	Required	Default
weight float
Weight in the defined unit	required	
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton)	optional	kg
distance float
Distance in the defined unit	required	
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi	optional	km

{
    //...
    "parameters": {
        "weight": 80,
        "weight_unit": "t",
        "distance": 100,
        "distance_unit": "mi"
    }
    //...
}

WeightOverTime

Calculate emissions produced by weight over time.
Attribute	Required	Default
weight float
Weight in the defined unit	required	
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton)	optional	kg
time float
Time amount	required	
time_unit string
Unit of time. One of ms, s, min, hour, day, year	optional	hour

{
    //...
    "parameters": {
        "weight": 80,
        "weight_unit": "t",
        "time": 20,
        "time_unit": "days"
    }
    //...
}