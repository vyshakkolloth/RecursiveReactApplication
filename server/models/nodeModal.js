const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({

  name: { type: String, required: true },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'nodeModal',
    default: null
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'nodeModal'
    }
  ]
});

module.exports = mongoose.model('nodeModal', PersonSchema);
