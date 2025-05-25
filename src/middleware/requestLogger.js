// src/middleware/requestLogger.js
export function requestLogger(req, res, next) {
  const { method, originalUrl, params, query, body, headers, ip } = req;
  const timestamp = new Date().toISOString();

  console.log(`\n[${timestamp}] ▶ ${method} ${originalUrl} — IP: ${ip}`);
  console.log("   Params:  ", JSON.stringify(params));
  console.log("   Query:   ", JSON.stringify(query));
  console.log("   Body:    ", JSON.stringify(body));
  if (req.userId) {
    console.log("   UserId:  ", req.userId);
  }

  // Monkey-patch res.send to capture the response body
  const originalSend = res.send;
  let responseBody;
  res.send = function (data) {
    responseBody = data;
    return originalSend.call(this, data);
  };

  // After response is sent, log status and body
  res.on('finish', () => {
    console.log(`   ◀ ${res.statusCode} ${res.statusMessage}`);
    try {
      const output = typeof responseBody === 'object'
        ? JSON.stringify(responseBody)
        : responseBody;
      console.log("   Response: ", output);
    } catch (err) {
      console.log("   Response: [unserializable]");
    }
  });

  next();
}
