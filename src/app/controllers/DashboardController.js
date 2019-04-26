const { User, Appointment } = require('../models/')
const { Op } = require('sequelize')
const moment = require('moment')

class DashboardController {
  async index (req, res) {
    let data = []
    const date = moment(new Date())
    if (req.session.user.provider) {
      data = await Appointment.findAll({
        where: {
          provider_id: req.session.user.id,
          date: {
            [Op.between]: [
              date.startOf('day').format(),
              date.endOf('day').format()
            ]
          }
        },
        include: [
          { model: User, as: 'Provider' },
          { model: User, as: 'Client' }
        ]
      })
    } else {
      data = await User.findAll({ where: { provider: true } })
    }
    return res.render('dashboard', { data })
  }
}

module.exports = new DashboardController()
