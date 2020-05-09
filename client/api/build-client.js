import axios from 'axios';

// La requête est faite sur le service du namespace de ingress-nginx et plus particulièrement sur le service ingress-nginx-controller.
// Pour connaitre la liste des services du namespace ingress-nginx
// kubectl get namespace <== pour connaitre les namespace
// kubectl get services -n ingress-nginx <== pour avoir la liste des services d'un namespace (ici ingress-nginx)


export default ({ req }) => {
    if (typeof window === 'undefined') {
        // we are on the servers
        // Request must be done on http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        })
    } else {
        // We are in the browser
        // request ca be made on ''
        return axios.create({
            baseURL: '/'
        })
    }
};
