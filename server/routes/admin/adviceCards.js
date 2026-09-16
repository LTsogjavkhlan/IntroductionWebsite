const AdviceCard = require('../../models/AdviceCard.js');
const createCrudRouter = require('./crudFactory.js');

const router = createCrudRouter(AdviceCard, {
    listKey: 'cards',
    itemKey: 'card',
    notFoundMessage: 'Зөвлөгөөний карт олдсонгүй.',
});

module.exports = router;
