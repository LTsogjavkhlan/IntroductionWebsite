const { Router } = require('express');
const asyncHandler = require('../../asyncHandler.js');

// Generic admin CRUD router shared by the hero/category/course/product/advice-card
// routes. Only the parts that genuinely differ per model (field shape, image
// upload handling, cascade rules) are passed in; list/create/update/delete
// wiring, 404 handling, and schema validation (via runValidators) live here once.
function createCrudRouter(Model, {
    listKey,
    itemKey,
    notFoundMessage,
    filterFields = [],
    sort = { order: 1 },
    uploadMiddleware,
    buildData,
    beforeDelete,
    afterDelete,
} = {}) {
    const router = Router();
    const uploadMiddlewares = uploadMiddleware ? [uploadMiddleware] : [];

    router.get('/', asyncHandler(async (req, res) => {
        const filter = {};
        filterFields.forEach((field) => {
            if (req.query[field]) filter[field] = req.query[field];
        });
        const items = await Model.find(filter).sort(sort);
        res.json({ success: true, [listKey]: items });
    }));

    router.post('/', ...uploadMiddlewares, asyncHandler(async (req, res) => {
        const data = buildData ? await buildData(req) : req.body;
        const item = await Model.create(data);
        res.status(201).json({ success: true, [itemKey]: item });
    }));

    router.put('/:id', ...uploadMiddlewares, asyncHandler(async (req, res) => {
        const data = buildData ? await buildData(req) : req.body;
        const item = await Model.findByIdAndUpdate(req.params.id, data, {
            new: true,
            runValidators: true,
            context: 'query',
        });
        if (!item) return res.status(404).json({ success: false, message: notFoundMessage });
        res.json({ success: true, [itemKey]: item });
    }));

    router.delete('/:id', asyncHandler(async (req, res) => {
        const item = await Model.findById(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: notFoundMessage });

        if (beforeDelete) {
            const blockMessage = await beforeDelete(item, req);
            if (blockMessage) return res.status(400).json({ success: false, message: blockMessage });
        }

        await Model.findByIdAndDelete(req.params.id);
        if (afterDelete) await afterDelete(item, req);
        res.json({ success: true });
    }));

    return router;
}

module.exports = createCrudRouter;
