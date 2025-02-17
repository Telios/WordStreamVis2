const REMAPPING_UCD = {
    "GR113-001": {name: "Salmonella", category: "Other"},
    "GR113-003": {name: "Intestinal infections", category: "Other"},
    "GR113-004": {name: "Tuberculosis", category: "Other"},
    "GR113-005": {name: "Respiratory tuberculosis", category: "Respiratory"},
    "GR113-006": {name: "O. tuberculosis", category: "Other"},
    "GR113-009": {name: "Meningococcal infection", category: "Other"},
    "GR113-010": {name: "Septicaemia", category: "Other"},
    "GR113-015": {name: "Viral Hepatitis", category: "Other"},
    "GR113-016": {name: "HIV", category: "Other"},
    "GR113-018": {name: "O. infectious diseases", category: "Other"},
    "GR113-019": {name: "Cancer", category: "Cancer"},
    "GR113-020": {name: "Mouth cancer", category: "Cancer"},
    "GR113-021": {name: "Food pipe cancer", category: "Cancer"},
    "GR113-022": {name: "Stomach cancer", category: "Cancer"},
    "GR113-023": {name: "Colon/Rectum cancer", category: "Cancer"},
    "GR113-024": {name: "Liver cancer", category: "Cancer"},
    "GR113-025": {name: "Pancreas cancer", category: "Cancer"},
    "GR113-026": {name: "Larynx cancer", category: "Cancer"},
    "GR113-027": {name: "Lung cancer", category: "Cancer"},
    "GR113-028": {name: "Skin cancer", category: "Cancer"},
    "GR113-029": {name: "Breast cancer", category: "Cancer"},
    "GR113-030": {name: "Cervix cancer", category: "Cancer"},
    "GR113-031": {name: "Uterus cancer", category: "Cancer"},
    "GR113-032": {name: "Ovary cancer", category: "Cancer"},
    "GR113-033": {name: "Prostate cancer", category: "Cancer"},
    "GR113-034": {name: "Kidney cancer", category: "Cancer"},
    "GR113-035": {name: "Bladder cancer", category: "Cancer"},
    "GR113-036": {name: "Brain cancer", category: "Cancer"},
    "GR113-037": {name: "Lymphoma cancer", category: "Cancer"},
    "GR113-038": {name: "Hodgkin disease", category: "Cancer"},
    "GR113-039": {name: "Non-Hodgkin lymphoma", category: "Cancer"},
    "GR113-040": {name: "Leukaemia", category: "Cancer"},
    "GR113-041": {name: "Multiple myeloma", category: "Cancer"},
    "GR113-042": {name: "O. lymphoid cancer", category: "Cancer"},
    "GR113-043": {name: "O. cancer", category: "Cancer"},
    "GR113-044": {name: "Unknown cancer", category: "Cancer"},
    "GR113-045": {name: "Anemias", category: "Other"},
    "GR113-046": {name: "Diabetes", category: "Other"},
    "GR113-047": {name: "Nutritional deficiencies", category: "Other"},
    "GR113-048": {name: "Malnutrition", category: "Other"},
    "GR113-049": {name: "O. nutritional deficiencies", category: "Other"},
    "GR113-050": {name: "Meningitis", category: "Other"},
    "GR113-051": {name: "Parkinson disease", category: "Other"},
    "GR113-052": {name: "Alzheimer disease", category: "Other"},
    "GR113-053": {name: "Cardiovascular disease", category: "Heart"},
    "GR113-054": {name: "Diseases of heart", category: "Heart"},
    "GR113-055": {name: "Rheumatic heart disease", category: "Heart"},
    "GR113-056": {name: "Hypertensive heart disease", category: "Heart"},
    "GR113-057": {name: "Hypertensive heart/renal disease", category: "Heart"},
    "GR113-058": {name: "Ischemic heart disease", category: "Heart"},
    "GR113-059": {name: "Myocardial infarction", category: "Heart"},
    "GR113-060": {name: "O. a. ischemic heart disease", category: "Heart"},
    "GR113-061": {name: "O. c. ischemic heart diseases", category: "Heart"},
    "GR113-062": {name: "Atherosclerotic cardiovascular disease", category: "Heart"},
    "GR113-063": {name: "All o. c. ischemic heart diseases", category: "Heart"},
    "GR113-064": {name: "O. heart disease", category: "Heart"},
    "GR113-065": {name: "Endocarditis", category: "Heart"},
    "GR113-066": {name: "Myocarditis", category: "Heart"},
    "GR113-067": {name: "Heart failure", category: "Heart"},
    "GR113-068": {name: "All o. heart diseases", category: "Heart"},
    "GR113-069": {name: "Kidney disease", category: "Other"},
    "GR113-070": {name: "Cerebrovascular diseases", category: "Other"},
    "GR113-071": {name: "Atherosclerosis", category: "Other"},
    "GR113-072": {name: "O. diseases of circulatory system", category: "Other"},
    "GR113-073": {name: "Aortic aneurysm", category: "Heart"},
    "GR113-074": {name: "O. diseases of arteries", category: "Other"},
    "GR113-075": {name: "O. disorders of circulatory system", category: "Other"},
    "GR113-076": {name: "Influenza and pneumonia", category: "Other"},
    "GR113-077": {name: "Influenza", category: "Other"},
    "GR113-078": {name: "Pneumonia", category: "Respiratory"},
    "GR113-079": {name: "O. a. lower respiratory infections", category: "Respiratory"},
    "GR113-080": {name: "A. bronchitis", category: "Respiratory"},
    "GR113-081": {name: "O. a. lower respiratory infections", category: "Respiratory"},
    "GR113-082": {name: "C. lower respiratory diseases", category: "Respiratory"},
    "GR113-083": {name: "C. Bronchitis", category: "Respiratory"},
    "GR113-084": {name: "Emphysema", category: "Respiratory"},
    "GR113-085": {name: "Asthma", category: "Respiratory"},
    "GR113-086": {name: "O. c. lower respiratory diseases", category: "Respiratory"},
    "GR113-087": {name: "Pneumoconioses", category: "Respiratory"},
    "GR113-088": {name: "Pneumonitis ", category: "Respiratory"},
    "GR113-089": {name: "O. diseases of respiratory system", category: "Respiratory"},
    "GR113-090": {name: "Peptic ulcer", category: "Other"},
    "GR113-091": {name: "Diseases of appendix", category: "Other"},
    "GR113-092": {name: "Hernia", category: "Other"},
    "GR113-093": {name: "C. liver disease and cirrhosis", category: "Other"},
    "GR113-094": {name: "Alcoholic liver disease", category: "Other"},
    "GR113-095": {name: "O. c. liver disease and cirrhosis", category: "Other"},
    "GR113-096": {name: "Cholelithiasis", category: "Other"},
    "GR113-097": {name: "Nephritis", category: "Other"},
    "GR113-098": {name: "A. nephritic", category: "Other"},
    "GR113-099": {name: "C. glomerulonephritis, nephritis", category: "Other"},
    "GR113-100": {name: "Kidney failure", category: "Other"},
    "GR113-102": {name: "Kidney infections", category: "Other"},
    "GR113-103": {name: "Hyperplasia of prostate", category: "Other"},
    "GR113-104": {name: "Inflammation female pelvic organs", category: "Other"},
    "GR113-105": {name: "Pregnancy/childbirth", category: "Other"},
    "GR113-106": {name: "Abortions", category: "Other"},
    "GR113-107": {name: "O. pregnancy complications", category: "Other"},
    "GR113-108": {name: "Perinatal complications", category: "Other"},
    "GR113-109": {name: "Birth defects", category: "Other"},
    "GR113-110": {name: "O. symptoms", category: "Other"},
    "GR113-111": {name: "All o. diseases", category: "Other"},
    "GR113-112": {name: "Accidents", category: "Other"},
    "GR113-113": {name: "Transport accidents", category: "Other"},
    "GR113-114": {name: "Car accidents", category: "Other"},
    "GR113-115": {name: "O. transport accidents", category: "Other"},
    "GR113-116": {name: "Water/Air/Space transport accidents", category: "Other"},
    "GR113-117": {name: "Nontransport accidents", category: "Other"},
    "GR113-118": {name: "Falls", category: "Other"},
    "GR113-119": {name: "Accidental gun discharge", category: "Other"},
    "GR113-120": {name: "Accidental drowning", category: "Other"},
    "GR113-121": {name: "Fire accident", category: "Other"},
    "GR113-122": {name: "Poison accident", category: "Other"},
    "GR113-123": {name: "O. nontransport accidents", category: "Other"},
    "GR113-124": {name: "Suicide", category: "Other"},
    "GR113-125": {name: "Suicide by gun", category: "Other"},
    "GR113-126": {name: "O. suicide", category: "Other"},
    "GR113-127": {name: "Homicide", category: "Other"},
    "GR113-128": {name: "Homicide by gun", category: "Other"},
    "GR113-129": {name: "O. homicide", category: "Other"},
    "GR113-130": {name: "Legal intervention", category: "Other"},
    "GR113-131": {name: "Undetermined intent", category: "Other"},
    "GR113-132": {name: "Police gun", category: "Other"},
    "GR113-133": {name: "Police", category: "Other"},
    "GR113-135": {name: "Medical care complications", category: "Other"},
    "GR113-136": {name: "Enterocolitis", category: "Other"},
    "GR113-137": {name: "COVID-19", category: "Other"},
};