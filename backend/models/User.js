const { dynamoDB } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.DYNAMODB_USERS_TABLE || 'FoodOrdering-Users';

class User {
  static async create(userData) {
    const { name, email, password, phone, address, role = 'customer' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: uuidv4(),
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const params = {
      TableName: TABLE_NAME,
      Item: user,
      ConditionExpression: 'attribute_not_exists(email)'
    };

    try {
      await dynamoDB.put(params).promise();
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === 'ConditionalCheckFailedException') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email.toLowerCase()
      }
    };

    const result = await dynamoDB.query(params).promise();
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  }

  static async findById(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };

    const result = await dynamoDB.get(params).promise();
    return result.Item || null;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateRole(id, role) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: 'SET #role = :role, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':role': role,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDB.update(params).promise();
    return result.Attributes;
  }
}

module.exports = User;