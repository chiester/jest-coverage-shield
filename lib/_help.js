/**
 * Help text
 */

module.exports = () => {
  console.log('  Examples:');
  console.log('');
  console.log(
    '    $ coverage-badger -e 90 -g 65 -r coverage/clover.xml -d coverage/'
  );
  console.log('      * Green: coverage >= 90');
  console.log('      * Yellow: 65 <= coverage < 90');
  console.log('      * Red: coverage < 65');
  console.log(
    '      * Created at the coverage directory from the given report.'
  );
  console.log('');
};
