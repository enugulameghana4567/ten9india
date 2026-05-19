const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const { protect, ownerOnly } = require('../middleware/auth');

const defaultContent = {
  home: {
    page: 'home',
    title: 'Sharing the Love of Christ Across Nations',
    subtitle: 'TEN9 Ministries India is committed to spreading the Gospel, transforming lives, caring for children, and serving communities through faith, compassion, and action.',
    content: {
      welcomeText: 'Welcome to TEN9 Ministries India — a Christ-centered ministry dedicated to sharing hope, faith, and transformation through Jesus Christ.',
      vision: 'To bring people closer to God and impact lives through love, prayer, worship, and service.',
      programs: ['Gospel Outreach', 'Child Care Support', 'Community Help', 'Building Projects', 'Christmas 2026 Mission']
    }
  },
  about: {
    page: 'about',
    title: 'About TEN9 Ministries India',
    subtitle: 'A Christ-centered ministry inspired by Epistle to the Romans 10:9',
    content: {
      description: 'TEN9 Ministries India is a Christ-centered ministry inspired by Epistle to the Romans 10:9, carrying the message of salvation, hope, and transformation through Jesus Christ. Founded with a vision to reach hearts across nations, TEN9 Ministries is headquartered in United States and extends its mission to India.',
      mission: 'To proclaim Jesus Christ, inspire faith, and transform lives through the power of the Gospel.',
      vision: 'To see lives restored, hearts revived, and nations touched by the love of Christ.',
      passions: ['Leading people into a deeper relationship with Jesus', 'Raising a generation rooted in God\'s Word', 'Spreading grace and hope to every community'],
      bibleVerse: '"If you declare with your mouth, \'Jesus is Lord,\' and believe in your heart that God raised Him from the dead, you will be saved." — Romans 10:9'
    }
  },
  whatwedo: {
    page: 'whatwedo',
    title: 'Our Ministries & Services',
    subtitle: 'Serving communities through faith and action',
    content: {
      services: [
        { name: 'Gospel Outreach', description: 'Sharing the Word of God through evangelism, prayer meetings, worship gatherings, and mission programs.' },
        { name: 'Community Support', description: 'Helping families and communities through food distribution, education support, and emergency assistance.' },
        { name: 'Prayer & Worship', description: 'Conducting worship events, spiritual counseling, and prayer support for individuals and families.' },
        { name: 'Youth Ministry', description: 'Encouraging young people to grow spiritually and become future leaders rooted in faith.' },
        { name: 'Child Care Mission', description: 'Providing care, education, love, and support for children in need.' }
      ]
    }
  },
  building: {
    page: 'building',
    title: 'Building Projects',
    subtitle: 'Creating spaces that bring hope and transformation',
    content: {
      description: 'TEN9 Ministries India is committed to building spaces that bring hope and transformation to communities.',
      projects: ['Prayer Hall Construction', 'Community Worship Center', 'Children\'s Care Facility', 'Educational Support Center'],
      goal: 'To create safe and welcoming environments for worship, learning, and community development.'
    }
  },
  christmas: {
    page: 'christmas',
    title: '🎄 Project Christmas 2026',
    subtitle: 'Spreading joy and love of Christ during Christmas',
    content: {
      mission: 'To spread the joy and love of Christ during Christmas by supporting underprivileged children and families.',
      activities: ['Christmas gifts for children', 'Food distribution', 'Worship celebrations', 'Community outreach', 'Winter clothing donations'],
      goal: 'To reach thousands of families with hope, prayer, and the message of Jesus Christ.'
    }
  },
  childcare: {
    page: 'childcare',
    title: 'Child Care Ministry',
    subtitle: 'Protecting, supporting, and uplifting children',
    content: {
      description: 'Our child care ministry is focused on protecting, supporting, and uplifting children through love and compassion.',
      provides: ['Educational support', 'Food and nutrition', 'Emotional care', 'Prayer and spiritual guidance', 'Safe and loving environments'],
      purpose: 'To help every child grow with dignity, hope, and faith.'
    }
  },
  getinvolved: {
    page: 'getinvolved',
    title: 'Get Involved',
    subtitle: 'Become part of our mission and help transform lives',
    content: {
      ways: ['Volunteer with us', 'Participate in outreach programs', 'Sponsor a child', 'Support prayer missions', 'Join worship events'],
      joinMessage: 'Together, we can bring hope and the love of Christ to communities everywhere.'
    }
  },
  give: {
    page: 'give',
    title: 'Your Give',
    subtitle: 'Your generous support helps us continue our mission',
    content: {
      description: 'Your generous support helps us continue serving communities, supporting children, and spreading the Gospel.',
      supports: ['Child care programs', 'Community outreach', 'Building projects', 'Food distribution', 'Christmas missions'],
      methods: ['Bank Transfer', 'UPI', 'Online Donations'],
      message: '"Every gift becomes a blessing to someone in need."',
      bankDetails: { bankName: '', accountNumber: '', ifsc: '', upi: '' }
    }
  },
  contact: {
    page: 'contact',
    title: 'Contact Us',
    subtitle: 'We would love to hear from you',
    content: {
      email: 'info@ten9ministries.in',
      phone: '+91 00000 00000',
      address: 'TEN9 Ministries India, Your City, India',
      socialLinks: { facebook: '', instagram: '', youtube: '', twitter: '' },
      closingMessage: '"Reach out to us for prayer, support, partnership, or ministry involvement."'
    }
  }
};

// Get all page content (public)
router.get('/:page', async (req, res) => {
  try {
    let content = await PageContent.findOne({ page: req.params.page });
    if (!content) {
      content = defaultContent[req.params.page];
      if (!content) return res.status(404).json({ message: 'Page not found' });
    }
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update page content (owner only)
router.put('/:page', protect, ownerOnly, async (req, res) => {
  try {
    const { title, subtitle, content } = req.body;
    let page = await PageContent.findOne({ page: req.params.page });
    if (!page) {
      page = await PageContent.create({ page: req.params.page, title, subtitle, content, updatedBy: req.user._id });
    } else {
      page.title = title || page.title;
      page.subtitle = subtitle || page.subtitle;
      page.content = content || page.content;
      page.updatedBy = req.user._id;
      await page.save();
    }
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
