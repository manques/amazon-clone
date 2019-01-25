const router = require('express').Router();
const algoliasearch = require('algoliasearch');

const client = algoliasearch('VIRINU4PT8', 'a7d9ea59c84d1fed6c1066571d78f4ce');
const index = client.initIndex('jnv');
router.route('/search')
    .get( (req, res, next) =>{
        const searchTerm = req.query.searchTerm;
        const page = req.query.page;
        console.log(searchTerm);
        console.log(page);
        index.search({ query: searchTerm, page: page }, (err, content) =>{
            if(err) next(err);
            console.log(content);
            res.json({
                success: true,
                message: 'Successfull!!',
                content: content,
                status: 200,
                searchTerm: searchTerm
            });
        });
    });

module.exports = router;