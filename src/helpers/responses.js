module.exports.serializePolicy = ({
  id, amountInsured, email, inceptionDate, installmentPayment
}) => ({
  id, amountInsured, email, inceptionDate, installmentPayment
});

module.exports.serializeClientPolicy = ({ id, amountInsured, inceptionDate }) => ({
  id, amountInsured, inceptionDate
});

module.exports.serializeClient = ({
  id, name, email, role, rawPolicies
}) => {
  const policies = rawPolicies ? rawPolicies.map(module.exports.clientPolicy) : [];
  return {
    id, name, email, role, policies
  };
};
