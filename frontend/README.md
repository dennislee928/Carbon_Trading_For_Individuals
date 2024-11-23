frontend/
├── app/
│ ├── (dashboard)/
│ │ └── page.tsx # Your main dashboard page with the search form
│ ├── api/
│ │ └── search-factors/
│ │ └── route.ts # API route handler
│ └── layout.tsx
├── components/
│ └── ui/
│ └── button.tsx # Your existing button component
├── types/
│ └── climatiq.ts # (New) Add this to store interfaces
└── .env.local # For your API key
//
Add a dedicated icons directory:

frontend/
components/
icons/ # New directory for custom icons
circle-dot.tsx
loader.tsx
index.ts # Export all icons
ui/ # Keep existing UI components

Consider grouping related components:

frontend/
components/
auth/ # Authentication related components
login-form.tsx
signup-form.tsx
layout/ # Layout components
header.tsx
footer.tsx
sidebar.tsx
dashboard/ # Dashboard specific components
icons/  
 ui/

Add a services directory for API calls:

frontend/
services/ # API and external service integrations
api/
climatiq.ts
auth.ts
stripe/
payment.ts

Add a hooks directory:

frontend/
hooks/ # Custom React hooks
useAuth.ts
useForm.ts
useApi.ts

Add a constants directory:

frontend/
constants/ # App-wide constants
routes.ts
api.ts
config.ts

Add a styles directory:

frontend/
styles/ # Global styles and theme
theme/
globals/

// improved structure:
frontend/
├── app/ # Next.js app directory (keep as is)
├── components/
│ ├── auth/ # Authentication components
│ ├── dashboard/ # Dashboard specific components
│ ├── icons/ # Custom icons
│ ├── layout/ # Layout components
│ └── ui/ # Reusable UI components
├── constants/ # App-wide constants
│ ├── routes.ts
│ ├── api.ts
│ └── config.ts
├── hooks/ # Custom React hooks
│ ├── useAuth.ts
│ ├── useForm.ts
│ └── useApi.ts
├── lib/ # Keep as is, but consider reorganizing
├── services/ # API and external services
│ ├── api/
│ └── stripe/
│ └── climatiq/
│ ├── index.ts # Main export file
│ ├── types/ # Type definitions
│ │ ├── index.ts # Export all types
│ │ ├── parameters.ts # API parameters types
│ │ ├── responses.ts # API response types
│ │ └── models.ts # Data models
│ ├── api/
│ │ ├── index.ts # Export all API functions
│ │ ├── emission.ts # Emission-related API calls
│ │ └── factors.ts # Factors-related API calls
│ ├── constants.ts # API endpoints, constants
│ └── utils.ts # Helper functions

├── styles/ # Global styles
│ ├── theme/
│ └── globals/
├── types/ # TypeScript types (keep as is)
└── utils/ # Utility functions

//
The Climatiq API has models that are used across a wide variety of endpoints.

    Selector is the model used if you're selecting an emission factor yourself. It allows you to select a specific emission factor by filtering based on sources, years, activity IDs and more.
    Parameters is the model used to pass parameters to the selected emission factor. This could contain e.g. money spent, energy used or fuel burned.
    Estimation is the model returned when the Climatiq API makes estimates.

//
Selector

A Selector is the model you use if you're selecting an emission factor yourself. A Selector allows you to select a specific emission factor via two distinct methods:

    You can use an activity ID for the particular activity you are interested in. As activity IDs can refer to multiple emission factors, you use the other metadata fields that Climatiq provides to filter down to those most suitable for your use case.
    You can use a unique ID which will always refer to the same emission factor

Using Activity ID

Emission factors can be queried by specifying a data version, an activity ID and a set of optional attributes. If more than one emission factor match the filtering criteria, the one from most recent year will be selected, followed by the most conservative (e.g. highest) if there is more than one available for the most recent year.
Attribute Required
data_version string
The required Data Version string for this request. required
activity_id string
An ID describing the activity that to search for. Multiple emission factors can share the same activity_id, e.g. if they are from a different source or apply to a different region. required
source string
Emission factor data source name. optional
source_dataset string
The name of the dataset the source published this emission factor under. optional
region string
Geographic region to which the emission factor applies. optional
region_fallback boolean
Set this to true if you're willing to accept a less specific geographical region than the one you've specified. Climatiq will then attempt to fall back to the larger region if it does not find any emission factors with the initial region. Only one fallback can be specified at a time. Default is false optional
year_fallback boolean
Set this to true if you're willing to accept a less specific year than the one you've specified. Climatiq will then attempt to find an emission factor with a year as close as possible to the one you've provided. Only one fallback can be specified at a time. Default is false optional
year integer
The year in which the emission factor is considered most relevant, according to the source. optional
source_lca_activity string
The Life Cycle Assessment (LCA) activity to which this factor is associated. optional
calculation_method "ar4", "ar5" or "ar6"
The calculation method that will be used to calculate the CO2e emission factor.
Learn more about calculation methods here. optional
allowed_data_quality_flags array of strings
A list of data quality flags that you are willing to allow for this estimate. See the guide on data quality flags for more information and defaults. You can supply an empty list [] if you only want to accept emission factors without detected data quality issues. optional

A selector for a specific activity, with additional filtering criteria can look like this:

"emission_factor": {
"data_version": "^3",
"activity_id": "electricity-supply_grid-source_production_mix",
"source": "MfE",
"region": "NZ",
"year": 2020
}

Using ID

Every emission factor has a unique ID, and if we update an emission factor in a new data version, it gets a new ID, so by using an ID as your selector, you can assure that you get consistent results. This could be useful for audit purposes.
Attribute Required
id string
An unique ID for one particular emission factor required
calculation_method "ar4", "ar5" or "ar6"
The calculation method that will be used to calculate the CO2e emission factor.
Learn more about calculation methods here. optional

A selector for one specific emission factor, using the unique id for that emission factor can look like this:

"emission_factor": {
"id": "da80d5f9-7fb2-4cd7-aa45-781479499845",
}
//
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
Attribute Required Default
area float
Area size in the defined unit required
area_unit string
Unit of area. One of m2, km2, ft2, ha optional km2

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
Attribute Required Default
area float
Area size in the defined unit required
area_unit string
Unit of area. One of m2, km2, ft2, ha optional km2
time float
Time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
Attribute Required Default
twenty_foot_equivalent float
The amount of twenty-foot-equivalent containers moved required
distance float
Distance in the defined unit required
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi optional km

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
Attribute Required Default
data float
Data size in the defined unit required
data_unit string
Unit of data. One of MB or GB, TB optional MB

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
Attribute Required Default
data float
Data size in the defined unit required
data_unit string
Unit of data. One of MB, GB or TB optional MB
time float
Time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
Attribute Required Default
distance float
Distance in the defined unit required
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi optional km

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
Attribute Required Default
distance float
Distance in the defined unit required
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi optional km
time float
Time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
Attribute Required Default
energy float
Energy in the defined unit required
energy_unit string
Unit of energy. One of Wh, kWh, MWh, MJ, GJ, TJ, therm or MMBTU optional kWh

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
Attribute Required Default
money float
Money amount in the defined unit required
money_unit string
ISO code of currency, such as usd, eur or gbp. See the list of all supported currencies. optional usd

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
ISO Currency Code Country Currency name
aed United Arab Emirates UAE dirham
afn Afghanistan Afghan afghani
all Albania Albanian lek
amd Armenia Armenian dram
ang Curaçao Netherlands Antillean gulden
aoa Angola Angolan kwanza
ars Argentina Argentine peso
aud Australia Australian dollar
awg Aruba Aruban florin
azn Azerbaijan Azerbaijani manat
bam Bosnia and Herzegovina Bosnia and Herzegovina konvertibilna marka
bbd Barbados Barbadian dollar
bdt Bangladesh Bangladeshi taka
bgn Bulgaria Bulgarian lev
bhd Bahrain Bahraini dinar
bif Burundi Burundi franc
bmd Bermuda Bermudian dollar
bnd Brunei Darussalam Brunei dollar
bob Plurinational State of Bolivia Bolivian boliviano
brl Brazil Brazilian real
bsd Bahamas Bahamian dollar
bwp Botswana Botswana pula
byn Belarus Belarusian ruble
cad Canada Canadian dollar
chf Switzerland & Liechtenstein Swiss franc
clp Chile Chilean peso
cny China Chinese/Yuan renminbi
cop Colombia Colombian peso
crc Costa Rica Costa Rican colon
cve Cape Verde Cape Verdean escudo
czk Czechia Czech koruna
djf Djibouti Djiboutian franc
dkk Denmark Danish krone
dop Dominican Republic Dominican peso
dzd Algeria Algerian dinar
egp Egypt Egyptian pound
etb Ethiopia Ethiopian birr
eur Euro Zone European Euro
fjd Fiji Fijian dollar
gbp United Kingdom British pound
gel Georgia Georgian lari
ghs Ghana Ghanaian cedi
gip Gibraltar Gibraltar pound
gmd Gambia Gambian dalasi
gtq Guatemala Guatemalan quetzal
gyd Guyana Guyanese dollar
hkd Hong Kong Hong Kong dollar
hnl Honduras Honduran lempira
hrk Croatia Croatian kuna
huf Hungary Hungarian forint
idr Indonesia Indonesian rupiah
ils Israel Israeli new sheqel
inr India Indian rupee
iqd Iraq Iraqi dinar
irr Iran Iranian rial
isk Iceland Icelandic króna
jmd Jamaica Jamaican dollar
jod Jordan Jordanian dinar
jpy Japan Japanese yen
kes Kenya Kenyan shilling
kgs Kyrgyzstan Kyrgyzstani som
khr Cambodia Cambodian riel
kmf Comoros Comorian franc
krw South Korea South Korean won
kwd Kuwait Kuwaiti dinar
kyd Cayman Islands Cayman Islands dollar
kzt Kazakhstan Kazakhstani tenge
lak Lao People's Democratic Republic Lao kip
lbp Lebanon Lebanese lira
lsl Lesotho Lesotho loti
lyd Libya Libyan dinar
mad Morocco Moroccan dirham
mdl Moldova, Republic of Moldovan leu
mga Madagascar Malagasy ariary
mkd North Macedonia Macedonian denar
mop Macao Macanese pataca
mur Mauritius Mauritian rupee
mur Mauritius Mauritian rupee
mvr Maldives Maldivian rufiyaa
mxn Mexico Mexican peso
myr Malaysia Malaysian ringgit
mzn Mozambique Mozambican metical
nad Namibia Namibian dollar
nio Nicaragua Nicaraguan córdoba
nok Norway Norwegian krone
npr Nepal Nepalese rupee
nzd New Zealand New Zealand dollar
omr Oman Omani rial
pab Panama Panamanian balboa
pen Peru Peruvian nuevo sol
php The Philippines Philippine peso
pkr Pakistan Pakistani rupee
pln Poland Polish zloty
pyg Paraguay Paraguayan guarani
qar Qatar Qatari riyal
ron Romania Romanian leu
rsd Serbia Serbian dinar
rub Russian Federation Russian ruble
rwf Rwanda Rwandan franc
sar Saudi Arabia Saudi riyal
scr Seychelles Seychellois rupee
sek Sweden Swedish krona
sgd Singapore Singapore dollar
sll Sierra Leone Sierra Leonean leone
srd Suriname Surinamese dollar
std Sao Tome and Principe São Tomé and Príncipe dobra
svc El Salvador Salvadoran Colon
szl Eswatini Swazi lilangeni
thb Thailand Thai baht
tjs Tajikistan Tajikistani somoni
tnd Tunisia Tunisian dinar
try Turkey Turkish new lira
ttd Trinidad and Tobago Trinidad and Tobago dollar
twd Taiwan New Taiwan dollar
uah Ukraine Ukrainian hryvnia
ugx Uganda Ugandan shilling
usd American Samoa United States dollar
uyu Uruguay Uruguayan peso
uzs Uzbekistan Uzbekistani som
vnd Vietnam Vietnamese dong
wst Samoa Samoan tala
xaf Cameroon Central African CFA franc
xcd Antigua and Barbuda East Caribbean dollar
xof Benin West African CFA franc
xpf French Polynesia CFP franc
yer Yemen Yemeni rial
zar South Africa South African rand
zmw Zambia Zambian kwacha
Number

This method works as a fallback for units without conversions like Hotel nights.
Attribute Required
number float
Unit amount required

{
//...
"parameters": {
"number": 3
}
//...
}

NumberOverTime

Calculate emissions by a number in a given time expressed in days, hours, minutes, seconds or milliseconds. The numbers are multiplied together, so doubling the number or the time will yield the same results.
Attribute Required Default
number float
The number required
time float
The time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
Attribute Required Default
passengers integer
Number of passengers optional 1
distance float
Distance in the defined unit required
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi optional km

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
Attribute Required Default
time float
Time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
Attribute Required Default
volume float
Volume in the defined unit required
volume_unit string
Unit of volume. One of ml, l, m3, standard_cubic_foot, gallons_us, bbl optional l

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
Attribute Required Default
weight float
Weight in the defined unit required
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton) optional kg

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
Attribute Required Default
weight float
Weight in the defined unit required
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton) optional kg
distance float
Distance in the defined unit required
distance_unit string
Unit of distance. One of m, km, ft, mi, nmi optional km

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
Attribute Required Default
weight float
Weight in the defined unit required
weight_unit string
Unit of weight. One of g, kg, t (metric ton), lb, ton (US short ton) optional kg
time float
Time amount required
time_unit string
Unit of time. One of ms, s, min, hour, day, year optional hour

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
//

Estimation

Many endpoints return one or more of the Estimation models described below. One Estimation model always uses one Emission Factor

, but when doing complex estimations, it is often necessary to combine multiple emission factors. In cases like that, endpoints often return multiple Estimation models.
Estimation

The Estimation response model is returned in a variety of estimation-related endpoints.

The model contains the total amount of emissions in kgCO2e, and includes the emission factor used for the calculation.
Attribute
co2e float
Emission factor carbon dioxide equivalent.
co2e_unit string
The unit in which the co2e field is expressed.
co2e_calculation_method string
Which calculation methodology that was used for the calculation. The value of this is either ar4, ar5 or ar6.
Learn more about calculation methods here.
co2e_calculation_origin string
Whether or not the data source or Climatiq made the calculation. The value of this is either source or climatiq.
Learn more about calculation methods here.
emission_factor used emission factor or null
The emission factor that was used for the calculation. This might be null if you do not have audit trail enabled.
constituent_gases constituent gases or null
Indicates which constituent gases the emission factor is composed of. This might be null if you do not have audit trail enabled.
audit_trail audit trail flag
Indicates whether Audit trail was enabled for this request. Is one of enabled, disabled or selector.
activity_data
Indicates the parameters which were multiplied by the factor to estimate emissions.

{
"co2e": 81,
"co2e_unit": "kg",
"co2e_calculation_method": "ar5",
"co2e_calculation_origin": "source",
"emission_factor": {
"name": "Electricity supplied from grid - residual mix",
"activity_id": "electricity-supply_grid-source_residual_mix",
"id": "fa8faa67-e212-48c5-a7ef-074cda9ac5f5",
"access_type": "public",
"source": "DISER",
"source_dataset": "National Greenhouse and Energy Reporting (Measurement) Determination (NGER)",
"year": 2024,
"region": "AU-NSW",
"category": "Electricity",
"source_lca_activity": "electricity_generation",
"data_quality_flags": []
},
"constituent_gases": {
"co2e_total": 81,
"co2e_other": null,
"co2": null,
"ch4": null,
"n2o": null
},
"activity_data": {
"activity_value": 100,
"activity_unit": "kWh"
},
"audit_trail": "selector"
}

EstimationWithSourceTrail

The EstimationWithSourceTrail model is the same as Estimation, but includes an additional source_trail field as well.
Extra Attributes
source_trail array of Source Data Points
An array of data points that help explain and provide trust in the calculation. Click to view more details about Source Trail.

{
"co2e": 0.0007366,
"co2e_unit": "kg",
"co2e_calculation_method": "ar5",
"co2e_calculation_origin": "source",
"emission_factor": {
"name": "Electricity supplied from grid",
"activity_id": "electricity-supply_grid-source_supplier_mix",
"id": "0de2d70a-4704-48f4-b862-1a86da206dd3",
"access_type": "public",
"source": "BEIS",
"source_dataset": "Greenhouse gas reporting: conversion factors 2024",
"year": 2024,
"region": "GB",
"category": "Electricity",
"source_lca_activity": "electricity_generation",
"data_quality_flags": []
},
"constituent_gases": {
"co2e_total": 0.0007366,
"co2e_other": null,
"co2": 0.0007291,
"ch4": 1.142e-7,
"n2o": 1.637e-8
},
"activity_data": {
"activity_value": 0.003558,
"activity_unit": "kWh"
},
"audit_trail": "enabled",
"source_trail": [
{
"data_category": "emission_factor",
"name": "Electricity supplied from grid",
"source": "BEIS",
"source_dataset": "Greenhouse gas reporting: conversion factors 2024",
"year": "2024",
"region": "GB",
"region_name": "United Kingdom"
}
]
}
