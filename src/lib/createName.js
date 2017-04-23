import url from 'url';

const createName = (address) => {
  const { hostname, pathname } = url.parse(address);
  const regExpRepl = /[^0-9a-z]/gi;
  const newName = url.format({
    hostname: hostname.replace(regExpRepl, '-'),
    pathname: pathname.replace(regExpRepl, '-'),
  });
  return [`${newName}.html`, `${newName}_file`];
};

export default createName;
