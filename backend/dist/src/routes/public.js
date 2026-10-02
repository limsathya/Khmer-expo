"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/expo', async (req, res) => {
    const expo = await prisma.event.findFirst();
    res.json(expo);
});
router.get('/program', async (req, res) => {
    const sessions = await prisma.eventSession.findMany({ orderBy: { date: 'asc' } });
    res.json(sessions);
});
router.get('/exhibitors', async (req, res) => {
    const { country, category, search } = req.query;
    const where = {};
    if (country)
        where.country = String(country);
    if (category)
        where.category = String(category);
    if (search)
        where.OR = [{ name: { contains: String(search), mode: 'insensitive' } }, { description: { contains: String(search), mode: 'insensitive' } }];
    const exhibitors = await prisma.exhibitor.findMany({ where });
    res.json(exhibitors);
});
router.get('/speakers', async (req, res) => {
    const speakers = await prisma.speaker.findMany();
    res.json(speakers);
});
router.get('/news', async (req, res) => {
    const articles = await prisma.newsArticle.findMany({ where: { status: 'Published' } });
    res.json(articles);
});
router.post('/registrations', async (req, res) => {
    const data = req.body;
    const uid = `EXPO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const registration = await prisma.registration.create({
        data: {
            uid,
            type: data.type || 'Visitor',
            status: 'Pending',
        },
    });
    const answers = Object.entries(data).map(([key, value]) => ({
        registrationId: registration.id,
        fieldKey: key,
        value: String(value),
    }));
    await prisma.registrationAnswer.createMany({ data: answers });
    res.status(201).json({ uid, status: registration.status });
});
exports.default = router;
//# sourceMappingURL=public.js.map