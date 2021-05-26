import json
import bcrypt
from connect import runQuery

saltRounds = None
with open("./encryption.prm", "r") as openFile:
    lines = openFile.readlines()
    for line in lines:
        [key, val] = line.split('=')
        if key == 'SALT_ROUNDS': saltRounds = int(val.strip())
        else:
            print("No SALT_ROUNDS var found in encryption.prm. Exiting...")
            exit()



class User:
    def __init__(self, displayName, email, password):
        """Password should be a byte object"""
        self.displayName = displayName
        self.email = email
        self.password = password
    
    @staticmethod
    def encode(password):
        hash = bcrypt.hashpw(password, bcrypt.gensalt(saltRounds))
        return hash.decode('utf-8')

    @staticmethod
    def getInsertTemplate():
        return 'INSERT INTO "user"("displayName", "email", "password") VALUES (%s, %s, %s) RETURNING "id"' 

    def getPayload(self):
        return (self.displayName, self.email, self.encode(self.password))

    def insert(self):
        # print(self.getInsertTemplate(), self.getPayload())
        return runQuery(self.getInsertTemplate(), self.getPayload())[0]

# testPass = b'anothertestpassword'
# print(User.encode(testPass))
