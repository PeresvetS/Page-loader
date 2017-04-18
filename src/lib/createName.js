import url from 'url';

const createName = (address) => {
  const parsedUrl = url.parse(address);
  const regExpRepl = /[^0-9a-z]/gi;
  const newName = url.format({
    hostname: parsedUrl.hostname.replace(regExpRepl, '-'),
    pathname: parsedUrl.pathname.replace(regExpRepl, '-'),
  });
  return newName;
};

export default createName;
