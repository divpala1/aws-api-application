import requests
import csv
import boto3

def lambda_handler(event, context):
    arr = []
    s3 = boto3.client('s3')
    s3BucketName = 'techwondoe-task-bucket'
    key = event['Records'][0]['s3']['object']['key']
    obj = s3.get_object(Bucket=s3BucketName, Key=key)
    data = obj['Body'].read().decode('utf-8').splitlines()
    
    csvFile = csv.reader(data)
    for lines in csvFile:
        if lines[3] == 'dob':
            continue
        else:
            tempDict = {
                        "id": int(lines[0]),
                        "name": lines[1],
                        "surname": lines[2],
                        "dob": lines[3],
                        "gender": lines[4]
                        }
        
            arr.append(tempDict)

    
    for i in range(0, len(arr), 1000):
        jsonData = {
            "entries" : arr[i:i+1000]
        }

        url = 'https://techwondoe-deployed-api.ue.r.appspot.com/upload'

        r = requests.post(url, json=jsonData)
        
        print(r.status_code)
