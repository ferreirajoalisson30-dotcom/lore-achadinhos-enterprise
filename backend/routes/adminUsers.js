const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Get all users (admin only)
router.get('/', async (req, res) => {
    try {
        const usersData = await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8');
        const users = JSON.parse(usersData);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar usuários' });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const usersData = await fs.readFile(path.join(__dirname, '../data/users.json'), 'utf8');
        let users = JSON.parse(usersData);
        
        const userIndex = users.findIndex(user => user.id === id);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        users[userIndex] = { ...users[userIndex], ...updates };
        
        await fs.writeFile(
            path.join(__dirname, '../data/users.json'), 
            JSON.stringify(users, null, 2)
        );
        
        res.json({ message: 'Usuário atualizado com sucesso', user: users[userIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

module.exports = router;