import { readdirSync, lstatSync, readFileSync, readlinkSync } from 'fs';
import { resolve, relative, join } from 'path';
import JSZip from 'jszip';

const getDirectories = (source: string): string[] =>
    readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => join(source, dirent.name));

const getFilePathsRecursively = (dir: string): string[] => {
    // returns a flat array of absolute paths of all files recursively contained in the dir
    let results: string[] = [];
    const list = readdirSync(dir);

    let pending = list.length;
    if (!pending) return results;

    for (let file of list) {
        file = resolve(dir, file);

        const stat = lstatSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(getFilePathsRecursively(file));
        } else {
            results.push(file);
        }

        if (!--pending) return results;
    }

    return results;
};

const getZipOfFolder = (dir: string): JSZip => {
    // returns a JSZip instance filled with contents of dir.

    const allPaths = getFilePathsRecursively(dir);

    const zip = new JSZip();
    for (const filePath of allPaths) {
        // let addPath = path.relative(path.join(dir, '..'), filePath); // use this instead if you want the source folder itself in the zip
        const addPath = relative(dir, filePath); // use this instead if you don't want the source folder itself in the zip
        const data = readFileSync(filePath);
        const stat = lstatSync(filePath);
        const permissions = stat.mode;

        if (stat.isSymbolicLink()) {
            zip.file(addPath, readlinkSync(filePath), {
                unixPermissions: parseInt('120755', 8), // This permission can be more permissive than necessary for non-executables but we don't mind.
                dir: stat.isDirectory(),
            });
        } else {
            zip.file(addPath, data, {
                unixPermissions: permissions,
                dir: stat.isDirectory(),
            });
        }
    }

    return zip;
};

export { getZipOfFolder, getDirectories };
