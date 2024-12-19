const { router } = require("../app");

router.get('*', function(req, res){
    res.status(404).send('what???');
  });
router.post('*', function(req, res){
    res.status(404).send('what???');
  }
);
router.put('*', function(req, res){
    res.status(404).send('what???');
  }
);

module.exports = router;