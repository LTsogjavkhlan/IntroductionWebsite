const { Router } = require('express');
const Course = require('../../models/Course.js');
const CourseSection = require('../../models/CourseSection.js');
const Category = require('../../models/Category.js');
const { upload, uploadImageBuffer } = require('../../upload.js');
const createCrudRouter = require('./crudFactory.js');

const router = Router();

const sectionsRouter = createCrudRouter(CourseSection, {
    listKey: 'sections',
    itemKey: 'section',
    notFoundMessage: 'Бүлэг олдсонгүй.',
    async beforeDelete(section) {
        const inUse = await Category.exists({ linkSectionId: section.sectionId });
        if (inUse) {
            return 'Энэ бүлгийг ашиглаж буй ангилал байгаа тул устгах боломжгүй. Эхлээд холбогдох ангиллыг өөрчилнө үү.';
        }
    },
    async afterDelete(section) {
        await Course.deleteMany({ sectionId: section.sectionId });
    },
});

const coursesRouter = createCrudRouter(Course, {
    listKey: 'courses',
    itemKey: 'course',
    notFoundMessage: 'Хичээл олдсонгүй.',
    filterFields: ['sectionId'],
    uploadMiddleware: upload.single('image'),
    async buildData(req) {
        const data = { ...req.body };
        if (req.file) data.imageUrl = await uploadImageBuffer(req.file.buffer);
        return data;
    },
});

router.use('/sections', sectionsRouter);
router.use('/', coursesRouter);

module.exports = router;
