
import socket
import struct
import sys
import re
import pprint

class Player:
    def __init__(self, name, frags, ping, address=None, bot=-1):
        self.name = name
        self.frags = frags
        self.ping = ping
        self.bot = bot
    def __str__(self):
        return self.name
    def __repr__(self):
        return str(self)
    def as_string(self):
        return {
            'name': self.name,
            'frags': self.frags,
            'ping': self.ping,
            'bot': self.bot,
        }

class PyQuake3:
    packet_prefix = '\xff' * 4
    player_reo = re.compile(r'^(\d+) (\d+) "(.*)"')
    def __init__(self, server, rcon_password=''):
        self.s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.set_server(server)
        self.set_rcon_password(rcon_password)
    def set_server(self, server):
        try:
            self.address, self.port = server.split(':')
        except:
            raise Exception('Server address must be in the format of \
                    "address:port"')
        self.port = int(self.port)
        self.s.connect((self.address, self.port))
    def get_address(self):
        return '%s:%s' % (self.address, self.port)
    def set_rcon_password(self, rcon_password):
        self.rcon_password = rcon_password
    def send_packet(self, data):
        self.s.send(b'\xFF\xFF\xFF\xFFgetstatus')
    def recv(self, timeout=1):
        self.s.settimeout(timeout)
        try:
            return self.s.recv(4096)
        except socket.error as e:
            raise Exception('Error receiving the packet: %s' % \
                    e[1])
    def command(self, cmd, timeout=1, retries=3):
        try:
            while retries:
                self.send_packet(cmd)
                try:
                    data = self.recv(timeout)
                except:
                    data = None
                if data:
                    return self.parse_packet(data)
                retries -= 1
        except:
            print(f'bad server -> {self.address}:{self.port}')
    def rcon(self, cmd):
        r = self.command('rcon "%s" %s' % (self.rcon_password, cmd))
        if r[1] == 'No rconpassword set on the server.\n' or r[1] == \
                'Bad rconpassword.\n':
            raise Exception(r[1][:-1])
        return r
    def parse_packet(self, data):
        data = data.decode('ISO-8859-1')
        if data.find(self.packet_prefix) != 0:
            raise Exception('Malformed packet')        
        first_line_length = data.find('\n')
        if first_line_length == -1:
            raise Exception('Malformed packet')
        response_type = data[len(self.packet_prefix):first_line_length]
        response_data = data[first_line_length+1:]
        return response_type, response_data
    def parse_status(self, data):
        split = data[1:].split('\\')
        values = dict(zip(split[::2], split[1::2]))
        # if there are \n's in one of the values, it's the list of players
        for var, val in values.items():
            pos = val.find('\n')
            if pos == -1:
                continue
            split = val.split('\n', 1)
            values[var] = split[0]
            self.parse_players(split[1])
        return values
    def parse_players(self, data):
        self.players = []
        for player in data.split('\n'):
            if not player:
                continue
            match = self.player_reo.match(player)
            if not match:
                #print(f'couldnt match {player}')
                continue
            frags, ping, name = match.groups()
            self.players.append(Player(name, frags, ping))
    def update(self):
        try:
            cmd, data = self.command('getstatus')
            self.vars = self.parse_status(data)
        except:
            print(f'cannot connect to {self.address}:{self.port}')
    def rcon_update(self):
        cmd, data = self.rcon('status')
        lines = data.split('\n')
        players = lines[3:]
        self.players = []
        for p in players:
            while p.find('  ') != -1:
                p = p.replace('  ', ' ')
            while p.find(' ') == 0:
                p = p[1:]
            if p == '':
                continue
            p = p.split(' ')
            self.players.append(Player(p[3][:-2], p[0], p[1], p[5], p[6]))

class MasterServer:
    def __init__(self, ip, port):
        self.MASTER = ip
        self.PORT = port
        self.servers = self.get_all_servers(ip, port)
        print(f'server list from: {ip}:{port}')
        pprint.pprint(self.servers)
        print('\nready.')

    def get_ip_port(self, packet):
        p = packet[len('\xFF\xFF\xFF\xFFgetserversResponse'):]
        addr = []
        while len(p) != 0:
            (ip_byte_0, ip_byte_1, ip_byte_2, ip_byte_3, port_byte_0, port_byte_1) = struct.unpack('BBBBBB', p[1:7])
            port = (port_byte_0 << 8) + port_byte_1
            ip = '%d.%d.%d.%d' % (ip_byte_0, ip_byte_1, ip_byte_2, ip_byte_3)
            addr.append((ip, port))
            p = p[7:]
        return addr

    master_data = {}
    player_reo = re.compile(r'^(\d+) (\d+) "(.*)"')

    def parse_status(self, data):
        split = data[1:].split('\\')
        values = dict(zip(split[::2], split[1::2]))
        # if there are \n's in one of the values, it's the list of players
        for var, val in values.items():
            pos = val.find('\n')
            if pos == -1:
                continue
            split = val.split('\n', 1)
            values[var] = split[0]
            self.parse_players(split[1])
        return values

    def get_all_servers(self, ip, port):
        s_list = []
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(10)
        s.connect((ip, port))
        msg = b'\xFF\xFF\xFF\xFFgetservers 60 empty full demo'
        s.send(msg)
        addr = {}
        d = s.recv(999999)
        for (ip, port) in self.get_ip_port(d):
            s_list.append(f'{ip}:{port}')
        s.close()
        return s_list

    def query_one(self, ip_port):
        print('querying 1')
        [ip, port] = ip_port.split(':')
        q = PyQuake3(ip_port,'asdf')
        q.update()
        if 'vars' in q.__dict__:
            
            return {
                'address': q.get_address(), 
                    'data': {
                    'ip': q.get_address(),
                    'hostname': q.vars['sv_hostname'],
                    'map': q.vars['mapname'],
                    'players_connected': len(q.players),
                    'max_players': q.vars['sv_maxclients'],
                    'mod': q.vars['gamename'],
                    'version': q.vars['version'],
                    'players': [p.as_string() for p in q.players]
                }
            }
        else:
            return {'address': ip_port, 'data': {}}


    def query(self):        
        all_servers = {}
        print('gettin ready')
        for s in self.servers:
            data = self.query_one(s)
            all_servers[data['address']] = data['data']
        
        return all_servers