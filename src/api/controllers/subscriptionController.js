function createSubscription(req, res) {
  const { userId, planId } = req.body;
  const subscription = new Subscription({
    userId,
    planId,
  });

  subscription.save((err, subscription) => {
    if (err) {
      return res.status(400).json({ error: 'Error creating subscription' });
    }
    return res.json({ message: 'Subscription created successfully', subscription });
  });
}